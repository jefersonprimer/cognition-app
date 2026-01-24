import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function FilterCircleIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M8.35 12.274a.625.625 0 0 0 0 1.25h3.3a.625.625 0 1 0 0-1.25zM13 9.844a.625.625 0 1 1 0 1.25H7a.625.625 0 0 1 0-1.25zm-7-2.43a.625.625 0 1 0 0 1.25h8a.625.625 0 1 0 0-1.25z">
      </Path>
      <Path d="M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25M3.625 10a6.375 6.375 0 1 1 12.75 0 6.375 6.375 0 0 1-12.75 0">
      </Path>
    </Svg>
  );
}
