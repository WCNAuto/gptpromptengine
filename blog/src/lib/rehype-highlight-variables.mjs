/**
 * rehype-highlight-variables.mjs
 *
 * Astro rehype plugin for GPT Prompt Engine.
 *
 * Runs at build time across all rendered markdown content.
 * Finds {single_curly} variables inside <blockquote> elements (the prompt
 * boxes) and wraps each one in <span class="var"> so the WDC signal green
 * styling can be applied via CSS.
 *
 * Example transformation:
 *   Input:  <blockquote><p>Employee: {employee_name}</p></blockquote>
 *   Output: <blockquote><p>Employee: <span class="var">{employee_name}</span></p></blockquote>
 *
 * Author: White Digital CANVAS
 * Project: gptpromptengine.com
 */

import { visit } from 'unist-util-visit';

// Matches {variable_name} or {variable_name: option1 / option2}
const VAR_REGEX = /\{[a-zA-Z_][a-zA-Z0-9_]*(?:\s*:\s*[^}]+)?\}/g;

export function rehypeHighlightVariables() {
  return (tree) => {
    // Only process text inside <blockquote> elements
    visit(tree, 'element', (blockquoteNode) => {
      if (blockquoteNode.tagName !== 'blockquote') return;

      visit(blockquoteNode, 'text', (textNode, index, parent) => {
        if (!parent || index === null || index === undefined) return;

        const matches = [...textNode.value.matchAll(VAR_REGEX)];
        if (matches.length === 0) return;

        const newNodes = [];
        let lastIndex = 0;

        for (const match of matches) {
          // Add any plain text before this match
          if (match.index > lastIndex) {
            newNodes.push({
              type: 'text',
              value: textNode.value.slice(lastIndex, match.index),
            });
          }

          // Add the variable wrapped in a span
          newNodes.push({
            type: 'element',
            tagName: 'span',
            properties: { className: ['var'] },
            children: [{ type: 'text', value: match[0] }],
          });

          lastIndex = match.index + match[0].length;
        }

        // Add any remaining plain text after the last match
        if (lastIndex < textNode.value.length) {
          newNodes.push({
            type: 'text',
            value: textNode.value.slice(lastIndex),
          });
        }

        // Replace the original text node with the new mixed nodes
        parent.children.splice(index, 1, ...newNodes);

        // Skip the newly-inserted nodes so we don't re-process them
        return ['skip', index + newNodes.length];
      });
    });
  };
}
