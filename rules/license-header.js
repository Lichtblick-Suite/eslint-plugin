// A custom eslint rule checking for the existence of an MPL license header,
// while allowing certain prefixes that cannot be moved below the license header.

const ALLOWED_PREFIX_LINES = ["/** @jest-environment jsdom */"];
const LICENSE_HEADER = `
// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
`.trim();

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [],
    messages: {
      missingLicenseError: "Missing license error",
    },
  },

  create: (context) => {
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
        }
      },
    };
  },
};
