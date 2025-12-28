import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, FontFamily, FontSize, LineHeight } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  color?: keyof typeof Colors;
  type?:
    | 'largeTitle'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'body'
    | 'callout'
    | 'subhead'
    | 'footnote'
    | 'caption'
    | 'link';
};

export function ThemedText({ style, color, type = 'body', ...rest }: ThemedTextProps) {
  const textColor = color ? Colors[color] : Colors.foreground;

  return (
    <Text
      style={[
        { color: textColor },
        styles.base,
        type === 'largeTitle' && styles.largeTitle,
        type === 'title1' && styles.title1,
        type === 'title2' && styles.title2,
        type === 'title3' && styles.title3,
        type === 'body' && styles.body,
        type === 'callout' && styles.callout,
        type === 'subhead' && styles.subhead,
        type === 'footnote' && styles.footnote,
        type === 'caption' && styles.caption,
        type === 'link' && styles.link,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily.regular,
  },
  largeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.largeTitle,
    lineHeight: FontSize.largeTitle * LineHeight.largeTitle,
  },
  title1: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.title1,
    lineHeight: FontSize.title1 * LineHeight.title1,
  },
  title2: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.title2,
    lineHeight: FontSize.title2 * LineHeight.title2,
  },
  title3: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.title3,
    lineHeight: FontSize.title3 * LineHeight.title3,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * LineHeight.body,
  },
  callout: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.callout,
    lineHeight: FontSize.callout * LineHeight.callout,
  },
  subhead: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subhead,
    lineHeight: FontSize.subhead * LineHeight.subhead,
  },
  footnote: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.footnote,
    lineHeight: FontSize.footnote * LineHeight.footnote,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption,
    lineHeight: FontSize.caption * LineHeight.caption,
  },
  link: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    lineHeight: FontSize.body * LineHeight.body,
    color: Colors.coral,
  },
});
