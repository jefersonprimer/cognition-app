import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function StarIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M10 2.399c.27 0 .51.174.594.432l1.507 4.636h4.874a.625.625 0 0 1 .367 1.13L13.4 11.462l1.506 4.636a.625.625 0 0 1-.962.699L10 13.932l-3.943 2.865a.625.625 0 0 1-.962-.699L6.6 11.462 2.658 8.597a.625.625 0 0 1 .367-1.13h4.874L9.406 2.83A.625.625 0 0 1 10 2.399m0 2.648L8.948 8.285a.625.625 0 0 1-.595.432H4.95l2.754 2.001c.22.16.31.441.227.699l-1.052 3.238 2.755-2.001a.625.625 0 0 1 .734 0l2.755 2.001-1.052-3.238a.625.625 0 0 1 .227-.699l2.754-2.001h-3.405a.625.625 0 0 1-.594-.432z">
      </Path>
    </Svg>
  );
}
