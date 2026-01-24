import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function StackIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M7.3 1.995a.55.55 0 1 0 0 1.1h5.4a.55.55 0 0 0 0-1.1zm-2.35 2.8a.55.55 0 0 1 .55-.55h9a.55.55 0 0 1 0 1.1h-9a.55.55 0 0 1-.55-.55m-1.987 3.75c0-1.174.951-2.125 2.125-2.125h9.825c1.174 0 2.125.951 2.125 2.125v6.45a2.125 2.125 0 0 1-2.125 2.125H5.088a2.125 2.125 0 0 1-2.125-2.125zm2.125-.875a.875.875 0 0 0-.875.875v6.45c0 .483.392.875.875.875h9.825a.875.875 0 0 0 .875-.875v-6.45a.875.875 0 0 0-.875-.875z">
      </Path>
    </Svg>
  );
}
