import { Building, Landmark, CreditCard, Wallet } from "lucide-react"

const partners = [
  { name: "Сбербанк", icon: Landmark },
  { name: "ВТБ", icon: Building },
  { name: "Альфа-Банк", icon: CreditCard },
  { name: "Газпромбанк", icon: Wallet },
  { name: "Россельхозбанк", icon: Landmark },
  { name: "Открытие", icon: Building },
]

export function Partners() {
  return (
    <section id="partners" className="py-20 lg:py-32 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Банки-партнёры</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Мы сотрудничаем с ведущими банками России</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <partner.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
