import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split into lines to identify lists and paragraphs
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    const ListTag = currentList.type;
    const items = [...currentList.items];
    const key = `list-${elements.length}`;

    elements.push(
      <ListTag
        key={key}
        className={`my-1.5 pl-5 text-xs space-y-1 ${
          ListTag === 'ul' ? 'list-disc' : 'list-decimal'
        }`}
      >
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {formatInline(item)}
          </li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Check for bullet list item: - or *
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (currentList && currentList.type !== 'ul') {
        flushList();
      }
      if (!currentList) {
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Check for ordered list item: 1. or 2.
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (currentList && currentList.type !== 'ol') {
        flushList();
      }
      if (!currentList) {
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    // Regular line / paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="my-1 text-xs leading-relaxed">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1 text-text">{elements}</div>;
};

/**
 * Formats inline bold (**text**), inline code (`code`), and markdown links [text](url)
 */
function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex to match bold, links, or code
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-text">
          {boldText}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeText = token.slice(1, -1);
      parts.push(
        <code
          key={`c-${match.index}`}
          className="px-1 py-0.5 rounded bg-surface-2 font-mono text-[11px] text-primary"
        >
          {codeText}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        parts.push(
          <a
            key={`a-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary-hover font-medium inline-flex items-center gap-0.5"
          >
            {linkText}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
