module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript', // TypeScriptを使用している場合
        ["next/babel"]
    ],
    plugins: ["@babel/plugin-proposal-class-properties"]
};

  
  