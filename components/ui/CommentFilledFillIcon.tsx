import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function CommentFilledFillIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="2.37 3.13 15.25 14.86" width={size} height={size} fill={color}>
      <Path d="M17.625 5.255A2.125 2.125 0 0 0 15.5 3.13h-11a2.125 2.125 0 0 0-2.125 2.125v7.5c0 1.173.951 2.125 2.125 2.125h1.188v2.482a.625.625 0 0 0 1.006.496l3.87-2.978H15.5a2.125 2.125 0 0 0 2.125-2.125zM5.95 7.505a.55.55 0 0 1 .55-.55h7a.55.55 0 0 1 0 1.1h-7a.55.55 0 0 1-.55-.55m.55 2.45h5a.55.55 0 0 1 0 1.1h-5a.55.55 0 1 1 0-1.1">
      </Path>
    </Svg>
  );
}
