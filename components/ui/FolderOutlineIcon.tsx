import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
  strokeWidth?: number;
}

export function FolderOutlineIcon({ color, size, strokeWidth = 1.5 }: Props) {
  return (
   <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} accessible accessibilityRole="image" accessibilityLabel="Ícone de pasta">
      <Path
        d="M3 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
