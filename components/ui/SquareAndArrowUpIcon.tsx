import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function SquareAndArrowUpIcon({ color, size }: Props) {
  return (
  <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M9.533.62a.625.625 0 0 1 .884 0l2.5 2.5a.625.625 0 1 1-.884.884l-1.408-1.408V11a.625.625 0 1 1-1.25 0V2.546L7.917 4.004a.625.625 0 1 1-.884-.883z"></Path><Path d="M8.125 5.125H5.5A2.125 2.125 0 0 0 3.375 7.25v7.5c0 1.174.951 2.125 2.125 2.125h9a2.125 2.125 0 0 0 2.125-2.125v-7.5A2.125 2.125 0 0 0 14.5 5.125h-2.625v1.25H14.5c.483 0 .875.392.875.875v7.5a.875.875 0 0 1-.875.875h-9a.875.875 0 0 1-.875-.875v-7.5c0-.483.392-.875.875-.875h2.625z">
      </Path>
    </Svg>
  );
}
