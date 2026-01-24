import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function PhotoFillIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="2.37 4.12 15.25 11.75" width={size} height={size} fill={color}>
      <Path d="M2.375 6.25c0-1.174.951-2.125 2.125-2.125h11c1.174 0 2.125.951 2.125 2.125v7.5a2.125 2.125 0 0 1-2.125 2.125h-11a2.125 2.125 0 0 1-2.125-2.125zm1.25 7.5c0 .483.392.875.875.875h11a.875.875 0 0 0 .875-.875v-2.791l-2.87-2.871a.625.625 0 0 0-.884 0l-4.137 4.136-1.98-1.98a.625.625 0 0 0-.883 0L3.625 12.24zM8.5 9.31a1.5 1.5 0 0 0 1.33-.806 1.094 1.094 0 0 1-.702-2.058A1.5 1.5 0 1 0 8.5 9.31">
      </Path>
    </Svg>
  );
}
