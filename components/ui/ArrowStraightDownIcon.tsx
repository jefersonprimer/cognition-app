import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function ArrowStraightDownIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M10.625 3a.625.625 0 1 0-1.25 0v12.491l-4.333-4.333a.625.625 0 1 0-.884.884l5.4 5.4a.62.62 0 0 0 .884 0l5.4-5.4a.625.625 0 0 0-.884-.884l-4.333 4.333z">
      </Path>
    </Svg>
  );
}
