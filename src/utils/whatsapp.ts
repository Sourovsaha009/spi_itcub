/**
 * Clean and format phone number for WhatsApp wa.me links
 * Handles Bangladesh local numbers (017...), international numbers (+880...),
 * or full wa.me URLs.
 */
export const formatWhatsAppLink = (input: string, memberName?: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Strip all non-digit characters
  let digits = trimmed.replace(/\D/g, '');

  // If starts with 01 (standard Bangladesh mobile format e.g. 01712345678), prepend Bangladesh country code 88
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '88' + digits;
  }

  const message = memberName
    ? `Hello ${memberName}, I found your contact on SPI IT Club website!`
    : 'Hello, I am contacting you from SPI IT Club website!';

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

/**
 * Get primary connect URL for a member (WhatsApp -> Facebook -> LinkedIn -> GitHub -> Website -> Email -> Phone)
 */
export const getPrimaryConnectLink = (
  socials?: {
    whatsapp?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    email?: string;
    phone?: string;
  },
  memberName?: string
): { url: string; label: string; icon: string } | null => {
  if (!socials) return null;

  if (socials.whatsapp && socials.whatsapp.trim()) {
    return {
      url: formatWhatsAppLink(socials.whatsapp, memberName),
      label: 'WhatsApp Chat',
      icon: 'fa-brands fa-whatsapp'
    };
  }

  if (socials.facebook && socials.facebook.trim()) {
    const fb = socials.facebook.trim();
    return {
      url: fb.startsWith('http') ? fb : `https://${fb}`,
      label: 'Facebook Profile',
      icon: 'fa-brands fa-facebook'
    };
  }

  if (socials.linkedin && socials.linkedin.trim()) {
    const li = socials.linkedin.trim();
    return {
      url: li.startsWith('http') ? li : `https://${li}`,
      label: 'LinkedIn Profile',
      icon: 'fa-brands fa-linkedin'
    };
  }

  if (socials.github && socials.github.trim()) {
    const gh = socials.github.trim();
    return {
      url: gh.startsWith('http') ? gh : `https://${gh}`,
      label: 'GitHub Profile',
      icon: 'fa-brands fa-github'
    };
  }

  if (socials.website && socials.website.trim()) {
    const ws = socials.website.trim();
    return {
      url: ws.startsWith('http') ? ws : `https://${ws}`,
      label: 'Personal Website',
      icon: 'fa-solid fa-globe'
    };
  }

  if (socials.email && socials.email.trim()) {
    return {
      url: `mailto:${socials.email.trim()}`,
      label: 'Direct Email',
      icon: 'fa-solid fa-envelope'
    };
  }

  if (socials.phone && socials.phone.trim()) {
    return {
      url: `tel:${socials.phone.trim()}`,
      label: 'Direct Call',
      icon: 'fa-solid fa-phone'
    };
  }

  return null;
};
