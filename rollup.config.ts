import { resolve } from 'path';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { localImport } from 'rollup-plugin-local-import';

const entries = [
    'index',
    'to-be-announced',
    'jest/index',
    'jest/register',
    'vitest/index',
    'vitest/register',
] as const;

export default entries
    .map((entry): RollupOptions[] => {
        const input = `./src/${entry}.ts`;

        function external(filename: string) {
            return filename !== resolve(input);
        }

        return [
            {
                input,
                output: {
                    file: `dist/${entry}.js`,
                    format: 'cjs',
                    exports: 'auto',
                    interop: 'compat',
                },
                plugins: [
                    esbuild(),
                    localImport((filename) => `${filename}.js`),
                ],
                external,
            },
            {
                input,
                output: {
                    file: `dist/${entry}.mjs`,
                    format: 'esm',
                },
                plugins: [
                    esbuild(),
                    localImport((filename) => `${filename}.mjs`),
                ],
                external,
            },
            {
                input,
                output: {
                    file: `dist/${entry}.d.ts`,
                    format: 'esm',
                },
                plugins: [esbuild(), dts()],
                external,
            },
        ];
    })
    .flat();
