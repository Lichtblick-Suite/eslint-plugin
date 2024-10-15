// A custom eslint rule checking for the existence of an MPL license header,
// while allowing certain prefixes that cannot be moved below the license header.

const ALLOWED_PREFIX_LINES = ["/** @jest-environment jsdom */"];

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [{
      type: "object",
      properties: {
          licenseType: {
          type: "string",
          descritpion: "Type of license that should be displayed on the header."
        }
      }
    }],
    messages: {
      missingLicenseError: "Missing license error",
    },
  },

  create: (context) => {
    console.log("console log", context);
    const LICENSE_TYPE = context.options[0];
    const LICENSE_HEADER = `
  // SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${LICENSE_TYPE}
    `.trim();
    return {
      Program: () => {
        const source = context.getSourceCode().getText();
        const headerIndex = source.indexOf(LICENSE_HEADER);
        const prefixLines = source.substring(0, headerIndex).trim().split("\n");
        const prefixLinesAreValid = prefixLines.every(
          (line) => line === "" || ALLOWED_PREFIX_LINES.includes(line)
        );
        if (headerIndex === -1 || !prefixLinesAreValid) {
          context.report({
            messageId: "missingLicenseError",
            loc: { start: 0, end: +source.indexOf("\n") + 1 },
            fix: () => {
              return { range: [0, 0], text: LICENSE_HEADER + "\n\n" };
            },
          });
        } else if (LICENSE_TYPE === null) {
          const startIndex = source.indexOf("SPDX-License-Identifier");
          const lines = source.substring(0, startIndex).split('\n');
          const lineNumber = lines.length;
          context.report({
            messageId: "missingTypeOfLicense",
            message: "Please add the type of license of the repository on .eslintrc.js",
            loc: {start: lineNumber, end: lineNumber}
          });
        }; 
      },
    };
  },
};
