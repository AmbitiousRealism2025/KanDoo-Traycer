// Domain model type definitions for Kandoo Flowboard

export interface Tag {
  id: string;
  label: string;
  color: string; // hex color code
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  tags: Tag[];
  columnId: string; // associates card with parent column
}

export interface Column {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string; // hex color code
  cards: Card[];
}
