import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function ArrowTurnUpRightIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M12.408 4.792a.625.625 0 0 1 .884-.884l4.4 4.4a.625.625 0 0 1 0 .884l-4.4 4.4a.625.625 0 0 1-.884-.884l3.333-3.333H5.25a.875.875 0 0 0-.875.875v5a.625.625 0 1 1-1.25 0v-5c0-1.173.951-2.125 2.125-2.125h10.491z">
      </Path>
    </Svg>
  );
}
