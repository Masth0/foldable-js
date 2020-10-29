import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/Foldable.ts',
    output: [
      {
        file: 'build/foldable.umd.js',
        format: 'umd',
        name: 'Foldable',
      },
    ],
    plugins: [typescript()],
  }
];
