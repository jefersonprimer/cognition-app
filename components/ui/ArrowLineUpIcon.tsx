import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function ArrowLineUpIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M15.85 3.65a.625.625 0 1 0 0-1.25H4.15a.625.625 0 1 0 0 1.25zm-1.008 6.692a.625.625 0 0 1-.884 0l-3.333-3.333v9.966a.625.625 0 1 1-1.25 0V7.009l-3.333 3.333a.625.625 0 1 1-.884-.884l4.4-4.4a.625.625 0 0 1 .884 0l4.4 4.4a.625.625 0 0 1 0 .884">
      </Path>
    </Svg>
  );
}
