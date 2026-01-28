import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Users,
  Building2,
  Mail,
  Bell,
  User,
  LogOut,
  Plus,
  Search,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Upload,
  FileText,
  Image,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Menu,
  Inbox,
  Send,
  Archive,
  Star,
  Heart,
  Share2,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Zap,
  Award,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  MapPin,
  Phone,
  MessageSquare,
  Video,
  Mic,
  Camera,
  Paperclip,
  Link2,
  Code,
  Terminal,
  Package,
  Box,
  Layers,
  Grid,
  List,
  Columns,
  Sidebar,
  Maximize,
  Minimize,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Home,
  Briefcase,
  BookOpen,
  HelpCircle,
  Settings2,
  Sliders,
  type LucideIcon,
} from "lucide-react";

export type IconName = keyof typeof icons;

export const icons = {
  // Navigation
  dashboard: LayoutDashboard,
  settings: Settings,
  billing: CreditCard,
  users: Users,
  home: Home,

  // Actions
  add: Plus,
  edit: Edit,
  delete: Trash2,
  copy: Copy,
  search: Search,
  filter: Filter,
  refresh: RefreshCw,
  send: Send,
  upload: Upload,
  download: Download,
  share: Share2,

  // Status
  check: Check,
  close: X,
  alert: AlertCircle,
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertCircle,

  // User
  user: User,
  mail: Mail,
  bell: Bell,
  logout: LogOut,
  shield: Shield,

  // Layout
  menu: Menu,
  moreVertical: MoreVertical,
  moreHorizontal: MoreHorizontal,
  sidebar: Sidebar,
  grid: Grid,
  list: List,
  columns: Columns,

  // Arrows & Chevrons
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,

  // Content
  file: FileText,
  image: Image,
  inbox: Inbox,
  archive: Archive,
  star: Star,
  heart: Heart,

  // Time & Data
  calendar: Calendar,
  clock: Clock,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  barChart: BarChart3,
  pieChart: PieChart,
  lineChart: LineChart,
  activity: Activity,

  // Finance
  dollar: DollarSign,
  creditCard: CreditCard,

  // Security
  lock: Lock,
  unlock: Unlock,
  eye: Eye,
  eyeOff: EyeOff,

  // Theme
  sun: Sun,
  moon: Moon,

  // External
  externalLink: ExternalLink,
  link: Link2,
  globe: Globe,

  // Communication
  message: MessageSquare,
  phone: Phone,
  video: Video,
  mic: Mic,
  camera: Camera,

  // Files
  paperclip: Paperclip,

  // Development
  code: Code,
  terminal: Terminal,
  package: Package,

  box: Box,
  layers: Layers,

  // Sorting
  sortAsc: SortAsc,
  sortDesc: SortDesc,

  // Resize
  maximize: Maximize,
  minimize: Minimize,

  // Business
  briefcase: Briefcase,
  building: Building2,
  mapPin: MapPin,

  // Learning
  book: BookOpen,
  help: HelpCircle,
  target: Target,
  award: Award,
  zap: Zap,

  // Settings
  settings2: Settings2,
  sliders: Sliders,
} as const;

export type { LucideIcon };
