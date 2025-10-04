import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import rn from "eslint-plugin-react-native";
import prettier from "eslint-plugin-prettier";
import jsonc from "eslint-plugin-jsonc";
import jsoncParser from "jsonc-eslint-parser";
import yml from "eslint-plugin-yml";
import yamlParser from "yaml-eslint-parser";

export default [
	js.configs.recommended,
	...ts.configs.recommended,

	{
		ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.expo/**"]
	},

	{
		files: ["apps/api/**/*.{ts,tsx}"],
		languageOptions: {
			parser: ts.parser
		}
	},

	{
		files: ["apps/web/**/*.{ts,tsx}"],
		plugins: {
			react,
			"react-hooks": reactHooks
		},
		languageOptions: {
			parser: ts.parser
		},
		settings: {
			react: {
				version: "detect"
			}
		},
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off"
		}
	},

	{
		files: ["apps/mobile/**/*.{ts,tsx,js,jsx}"],
		plugins: {
			react,
			"react-hooks": reactHooks,
			"react-native": rn
		},
		languageOptions: {
			parser: ts.parser
		},
		settings: {
			react: {
				version: "detect"
			}
		},
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"react-native/no-unused-styles": "warn",
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off"
		}
	},

	{
		files: ["**/*.json", "**/*.jsonc", "**/*.json5"],
		languageOptions: {
			parser: jsoncParser
		},
		plugins: {
			jsonc
		},
		rules: {
			"jsonc/array-bracket-newline": ["error", "consistent"],
			"jsonc/array-element-newline": ["error", "consistent"],
			"jsonc/indent": ["error", 2],
			"jsonc/key-spacing": ["error", {
				"beforeColon": false,
				"afterColon": true
			}],
			"jsonc/object-curly-newline": ["error", {
				"multiline": true,
				"consistent": true
			}],
			"jsonc/object-property-newline": ["error", {
				"allowAllPropertiesOnSameLine": true
			}],
			"jsonc/quote-props": ["error", "always"],
			"jsonc/quotes": ["error", "double"]
		}
	},

	{
		files: ["**/*.{yml,yaml}"],
		languageOptions: {
			parser: yamlParser
		},
		plugins: {
			yml
		},
		rules: {
			"yml/indent": ["error", 2],
			"yml/no-empty-document": "error",
			"yml/key-spacing": ["error", {
				"beforeColon": false,
				"afterColon": true
			}],
			"yml/no-irregular-whitespace": "error"
		}
	},

	{
		plugins: {
			prettier
		},
		rules: {
			"prettier/prettier": "error"
		}
	}
];