type TipTapNode = {
  type: string;
  text?: string;
  marks?: { type: string }[];
  content?: TipTapNode[];
};

function nodeToText(node: TipTapNode): string {
  if (node.type === 'text') {
    const text = node.text ?? '';
    return node.marks?.some((m) => m.type === 'bold') ? `**${text}**` : text;
  }
  const inner = node.content?.map(nodeToText).join('') ?? '';
  return node.type === 'paragraph' ? inner + '\n' : inner;
}

export function tiptapToText(content: string): string {
  try {
    return nodeToText(JSON.parse(content)).trimEnd();
  } catch {
    return content;
  }
}

export function textToTiptap(text: string): string {
  const content = text.split('\n').map((line) => ({
    type: 'paragraph',
    attrs: { textAlign: null },
    content: [...line.matchAll(/\*\*(.+?)\*\*|([^*]+)/g)].map(([, bold, plain]) => (bold ? { type: 'text', marks: [{ type: 'bold' }], text: bold } : { type: 'text', text: plain }))
  }));
  return JSON.stringify({ type: 'doc', content });
}
