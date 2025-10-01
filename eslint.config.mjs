import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import rn from "eslint-plugin-react-native";
import prettier from "eslint-plugin-prettier";

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
		plugins: {
			prettier
		},
		rules: {
			"prettier/prettier": "error"
		}
	}
];