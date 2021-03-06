import { Rule, Tree } from '@angular-devkit/schematics';
import {
  getNpmScope,
  insert,
  toFileName,
  toPropertyName,
} from '@nrwl/workspace';
import { insertImport } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';
import { addImportToModule, addRoute } from '../../../utils/ast-utils';
import { NormalizedSchema } from './normalized-schema';

export function addChildren(options: NormalizedSchema): Rule {
  return (host: Tree) => {
    const npmScope = getNpmScope(host);
    if (!host.exists(options.parentModule)) {
      throw new Error(`Cannot find '${options.parentModule}'`);
    }
    const moduleSource = host.read(options.parentModule)!.toString('utf-8');
    const sourceFile = ts.createSourceFile(
      options.parentModule,
      moduleSource,
      ts.ScriptTarget.Latest,
      true
    );
    const constName = `${toPropertyName(options.fileName)}Routes`;
    const importPath = `@${npmScope}/${options.projectDirectory}`;

    insert(host, options.parentModule, [
      insertImport(
        sourceFile,
        options.parentModule,
        `${options.moduleName}, ${constName}`,
        importPath
      ),
      ...addImportToModule(
        sourceFile,
        options.parentModule,
        options.moduleName
      ),
      ...addRoute(
        options.parentModule,
        sourceFile,
        `{path: '${toFileName(options.fileName)}', children: ${constName}}`
      ),
    ]);
    return host;
  };
}
