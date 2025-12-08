import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer id="contacts" className="py-16 bg-sidebar border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">Л</span>
              </div>
              <span className="text-xl font-bold text-foreground">ЛидерГарант</span>
            </Link>
            <p className="text-muted-foreground text-sm">Финансовый маркетплейс для клиентов, агентов и партнёров</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="#partners" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Банк-партнёры
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />8 800 123-45-67
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                info@lidergarant.ru
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                г. Москва, ул. Финансовая, д. 1
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Документы</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-center text-muted-foreground text-sm">ЛидерГарант © 2025. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
