import React from 'react';
import { Svg, Path } from 'react-native-svg';

type Props = {
  color: string;
  size: number;
}

export function TextTranslaterIcon({ color, size }: Props) {
  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={size} height={size} fill={color}>
      <Path d="M14.776 5.217a.625.625 0 1 0-1.25 0v.967H9.524a.625.625 0 1 0 0 1.25h6.688c-.32.87-.963 2.091-2.06 3.375a12.8 12.8 0 0 1-1.48-2.122.625.625 0 1 0-1.095.603c.415.754.978 1.589 1.717 2.438a16.3 16.3 0 0 1-3.341 2.512.625.625 0 0 0 .62 1.085 17.6 17.6 0 0 0 3.58-2.688 17.6 17.6 0 0 0 3.577 2.688.625.625 0 1 0 .622-1.085 16.3 16.3 0 0 1-3.342-2.512c1.42-1.632 2.196-3.216 2.52-4.294h1.251a.625.625 0 1 0 0-1.25h-4.005zm-8.014 7.16.958 2.62a.625.625 0 0 0 1.174-.43L5.645 5.683a.94.94 0 0 0-1.765 0L.632 14.568a.625.625 0 1 0 1.174.43l.958-2.621zm-.457-1.25H3.221l1.542-4.219z">
      </Path>
    </Svg>
  );
}
