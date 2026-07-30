import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomImageView from "@/components/editor/CustomImageView";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: null,
        renderHTML: (attributes) =>
          attributes.width ? { width: attributes.width } : {},
      },

      height: {
        default: null,
        renderHTML: (attributes) =>
          attributes.height ? { height: attributes.height } : {},
      },

      size: {
        default: "medium",
        renderHTML: (attributes) => ({
          "data-size": attributes.size,
        }),
      },

      align: {
        default: "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
        }),
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),

      setImageSize:
        (size) =>
        ({ commands }) => {
          const presets = {
            small: 300,
            medium: 600,
            large: 900,
            full: null,
          };

          return commands.updateAttributes(this.name, {
            size,
            width: presets[size],
            height: null,
          });
        },

      setImageDimensions:
        (width, height = null) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            width,
            height,
            size: "custom",
          });
        },

      setImageAlignment:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            align,
          });
        },

      setImageAlt:
        (alt) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            alt,
          });
        },

      setImageTitle:
        (title) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            title,
          });
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(CustomImageView);
  },
});

export default CustomImage;
