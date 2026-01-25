import React from 'react';
import TextBlock from './TextBlock';
import CardsBlock from './CardsBlock';
import BannerBlock from './BannerBlock';
import GalleryBlock from './GalleryBlock';
import ButtonsBlock from './ButtonsBlock';
import FormBlock from './FormBlock';

function BlockRenderer({ block }) {
  if (block.hidden) return null;

  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'cards':
      return <CardsBlock block={block} />;
    case 'banner':
      return <BannerBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} />;
    case 'buttons':
      return <ButtonsBlock block={block} />;
    case 'form':
      return <FormBlock block={block} />;
    default:
      return null;
  }
}

export default BlockRenderer;

