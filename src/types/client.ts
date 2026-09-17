export interface ClientConfig {
  name: string;
  subdomain: string;
  tagline?: string;
  features: string[];
  adminEnabled: boolean;
}

export interface ClientRouteParams {
  client_name: string;
}

export interface ClientPageProps {
  params: Promise<ClientRouteParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface ClientLayoutProps {
  children: React.ReactNode;
  params: Promise<ClientRouteParams>;
}
