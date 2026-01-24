import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function ClockIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M10.625 5.725a.625.625 0 1 0-1.25 0v3.65H6.4a.625.625 0 1 0 0 1.25H10c.345 0 .625-.28.625-.625z">
      </Path>
      <Path d="M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25M3.625 10a6.375 6.375 0 1 1 12.75 0 6.375 6.375 0 0 1-12.75 0">
      </Path>
    </Svg>
  );
}
