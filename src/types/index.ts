export interface JumplinkItem {
  id: string;
  name: string;
  ariaLabel: string;
}

export interface FeatureSectionData {
  id: string;
  category: string;
  inlineIcon: string;
  iconColor?: string;
  titlePrefix: string;
  titleSuffix: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
  isExternalCta?: boolean;
  footnote?: string;
  lottieUrl: string;
  imagePosition: 'left' | 'right';
  altText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  links?: { text: string; url: string }[];
}

export interface WalletCard {
  id: string;
  type: 'payment' | 'transit' | 'loyalty' | 'ticket' | 'id' | 'key';
  title: string;
  subtitle: string;
  brand: string;
  cardNumber?: string;
  expiry?: string;
  balanceOrSeat?: string;
  bgColor: string;
  textColor: string;
  iconName: string;
  status?: string;
}
