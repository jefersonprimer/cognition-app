import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function ArrowInCircleUpFillIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M10 17.625a7.625 7.625 0 1 0 0-15.25 7.625 7.625 0 0 0 0 15.25m3.042-8.07a.625.625 0 0 1-.884 0L10.625 8.02v5.466a.625.625 0 1 1-1.25 0V8.021L7.842 9.554a.625.625 0 1 1-.884-.883l2.6-2.6a.625.625 0 0 1 .884 0l2.6 2.6a.625.625 0 0 1 0 .883">
      </Path>
    </Svg>
  );
}
