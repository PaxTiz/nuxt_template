<script lang="tsx" setup>
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import InsertImageModal from './InsertImageModal.vue';
import InsertLinkModal from './InsertLinkModal.vue';
import ToolbarItem from './ToolbarItem.vue';

const modelValue = defineModel({ required: true });

const dialog = useDialog();
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    Link,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image.configure({ allowBase64: true }),
  ],
  editorProps: {
    attributes: {
      class: 'prose max-w-none focus:outline-none',
    },
  },

  onUpdate({ editor }) {
    modelValue.value = editor.getHTML();
  },
});

const insertImage = () => {
  dialog.open(InsertImageModal, {
    props: {
      modal: true,
      blockScroll: true,
      draggable: false,
      header: 'Insérer une image',
      style: {
        width: '100%',
        maxWidth: '500px',
      },
    },
    onClose(options) {
      const file = options?.data as
        | { src: string; title?: string; alt?: string }
        | undefined;

      if (file) {
        editor.value?.commands.setImage(file);
      }
    },
  });
};

const insertLink = () => {
  if (!editor.value) {
    return;
  }

  dialog.open(InsertLinkModal, {
    data: {
      previousURL: editor.value.getAttributes('link').href,
    },
    props: {
      modal: true,
      blockScroll: true,
      draggable: false,
      header: 'Insérer un lien',
      style: {
        width: '100%',
        maxWidth: '500px',
      },
    },
    onClose(options) {
      if (!editor.value) {
        return;
      }

      const link = options?.data as
        | { href: string; target: string }
        | undefined;

      if (!link?.href) {
        return;
      }

      editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: link.href, target: link.target })
        .run();
    },
  });
};

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="editor">
    <div class="editor__toolbar">
      <div class="editor__toolbar-group">
        <ToolbarItem
          name="Gras"
          icon="bold"
          :active="editor?.isActive('bold')"
          @click="() => editor?.chain().focus().toggleBold().run()"
        />
        <ToolbarItem
          name="Italique"
          icon="italic"
          :active="editor?.isActive('italic')"
          @click="() => editor?.chain().focus().toggleItalic().run()"
        />
        <ToolbarItem
          name="Souligné"
          icon="underline"
          :active="editor?.isActive('underline')"
          @click="() => editor?.chain().focus().toggleUnderline().run()"
        />
        <ToolbarItem
          name="Barré"
          icon="strikethrough"
          :active="editor?.isActive('strikethrough')"
          @click="() => editor?.chain().focus().toggleStrike().run()"
        />
        <ToolbarItem
          name="Retirer le formattage"
          icon="remove-formatting"
          :active="false"
          @click="() => editor?.chain().focus().unsetAllMarks().run()"
        />
      </div>

      <div class="editor__toolbar-group">
        <ToolbarItem
          name="Niveau d'entête 1"
          icon="heading-1"
          :active="editor?.isActive('heading', { level: 1 })"
          @click="
            () => editor?.chain().focus().toggleHeading({ level: 1 }).run()
          "
        />
        <ToolbarItem
          name="Niveau d'entête 2"
          icon="heading-2"
          :active="editor?.isActive('heading', { level: 2 })"
          @click="
            () => editor?.chain().focus().toggleHeading({ level: 2 }).run()
          "
        />
        <ToolbarItem
          name="Niveau d'entête 3"
          icon="heading-3"
          :active="editor?.isActive('heading', { level: 3 })"
          @click="
            () => editor?.chain().focus().toggleHeading({ level: 3 }).run()
          "
        />
        <ToolbarItem
          name="Niveau d'entête 4"
          icon="heading-4"
          :active="editor?.isActive('heading', { level: 4 })"
          @click="
            () => editor?.chain().focus().toggleHeading({ level: 4 }).run()
          "
        />
      </div>

      <div class="editor__toolbar-group">
        <ToolbarItem
          name="Bloc de citation"
          icon="quote"
          :active="editor?.isActive('blockquote')"
          @click="() => editor?.chain().focus().toggleBlockquote().run()"
        />
        <ToolbarItem
          name="Ligne horizontale"
          icon="more-horizontal"
          :active="false"
          @click="() => editor?.chain().focus().setHorizontalRule().run()"
        />
        <ToolbarItem
          name="Liste non ordonnée"
          icon="list"
          :active="editor?.isActive('bulletList')"
          @click="() => editor?.chain().focus().toggleBulletList().run()"
        />
        <ToolbarItem
          name="Liste ordonnée"
          icon="list-ordered"
          :active="editor?.isActive('orderedList')"
          @click="() => editor?.chain().focus().toggleOrderedList().run()"
        />
      </div>

      <div class="editor__toolbar-group">
        <ToolbarItem
          name="Insérer un lien"
          icon="link"
          :active="editor?.isActive('link')"
          @click="insertLink"
        />
        <ToolbarItem
          name="Retirer le lien"
          icon="unlink"
          :active="editor?.isActive('link')"
          @click="editor?.chain().focus().unsetLink().run()"
        />
        <ToolbarItem
          name="Insérer une image"
          icon="image"
          :active="false"
          @click="insertImage"
        />
      </div>

      <div class="editor__toolbar-group">
        <ToolbarItem
          name="Alignement à gauche"
          icon="align-left"
          :active="editor?.isActive({ textAlign: 'left' })"
          @click="() => editor?.chain().focus().setTextAlign('left').run()"
        />
        <ToolbarItem
          name="Alignement au centre"
          icon="align-center"
          :active="editor?.isActive({ textAlign: 'center' })"
          @click="() => editor?.chain().focus().setTextAlign('center').run()"
        />
        <ToolbarItem
          name="Alignement à droite"
          icon="align-right"
          :active="editor?.isActive({ textAlign: 'right' })"
          @click="() => editor?.chain().focus().setTextAlign('right').run()"
        />
        <ToolbarItem
          name="Alignement justifié"
          icon="align-justify"
          :active="editor?.isActive({ textAlign: 'justify' })"
          @click="() => editor?.chain().focus().setTextAlign('justify').run()"
        />
      </div>

      <div class="editor__toolbar-group">
        <ToolbarItem
          name="Annuler"
          icon="undo"
          :active="false"
          @click="() => editor?.chain().focus().undo().run()"
        />
        <ToolbarItem
          name="Refaire"
          icon="redo"
          :active="false"
          @click="() => editor?.chain().focus().redo().run()"
        />
      </div>
    </div>

    <div class="editor__content">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor {
  border: 1px solid theme('borderColor.gray.300');
  border-radius: theme('borderRadius.DEFAULT');
}

.editor .editor__toolbar {
  display: flex;
  align-items: center;
  gap: theme('gap.4');
  flex-wrap: wrap;
  border-bottom: 1px solid theme('borderColor.gray.300');
  background-color: theme('backgroundColor.gray.50');
  padding: theme('padding.2');

  &-group {
    display: flex;
    align-items: center;
  }
}

.editor__toolbar-group .editor__toolbar-button {
  &:first-child {
    border-top-left-radius: theme('borderRadius.DEFAULT');
    border-bottom-left-radius: theme('borderRadius.DEFAULT');
  }
  &:last-child {
    border-top-right-radius: theme('borderRadius.DEFAULT');
    border-bottom-right-radius: theme('borderRadius.DEFAULT');
  }

  &:not(:last-child) {
    border-right: none;
  }
}

.editor__toolbar-button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  background-color: theme('backgroundColor.white');
  border: 1px solid theme('colors.gray.300');
  cursor: pointer;

  &.active {
    color: theme('colors.primary');
    background-color: theme('backgroundColor.blue.100');
  }
}

.editor .editor__content {
  padding: theme('padding.2');

  :deep(a) {
    color: theme('colors.primary');
    text-decoration: underline;
  }
}
</style>
