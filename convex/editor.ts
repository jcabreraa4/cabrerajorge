import { StarterKit } from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { BulletList, TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';

export const extensions = [StarterKit.configure({ link: false }), TextStyleKit, TaskList, TaskItem.configure({ nested: true }), TableKit.configure({ table: { resizable: true } }), Highlight.configure({ multicolor: true }), Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }), TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] })];
