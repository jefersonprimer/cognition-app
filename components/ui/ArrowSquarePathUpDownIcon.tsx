import React from 'react';
import { Svg, Path } from 'react-native-svg';
 
type Props = {
  color: string;
  size: number;
}

export function ArrowSquarePathUpDownIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M6.475 3.125a.625.625 0 1 0 0 1.25h7.975c.65 0 1.175.526 1.175 1.175v6.057l-1.408-1.408a.625.625 0 1 0-.884.884l2.475 2.475a.625.625 0 0 0 .884 0l2.475-2.475a.625.625 0 0 0-.884-.884l-1.408 1.408V5.55a2.425 2.425 0 0 0-2.425-2.425zM3.308 6.442a.625.625 0 0 1 .884 0l2.475 2.475a.625.625 0 1 1-.884.884L4.375 8.393v6.057c0 .649.526 1.175 1.175 1.175h7.975a.625.625 0 0 1 0 1.25H5.55a2.425 2.425 0 0 1-2.425-2.425V8.393L1.717 9.801a.625.625 0 1 1-.884-.884z">
      </Path>
    </Svg>  
  );
}
