import { FileText, FileSearch, Landmark, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: CheckCircle2,
    title: "Аккредитация",
    description: "Быстрая аккредитация вашей компании для работы с финансовыми продуктами",
  },
  {
    icon: FileText,
    title: "Подача заявок",
    description: "Простая и удобная система подачи заявок на финансирование онлайн",
  },
  {
    icon: FileSearch,
    title: "Работа с документами",
    description: "Загрузка, хранение и управление всеми необходимыми документами",
  },
  {
    icon: Landmark,
    title: "Банковский подбор",
    description: "Подбор оптимальных банковских предложений под ваши потребности",
  },
]

const advantages = [
  {
    icon: "24/7",
    title: "Круглосуточная поддержка",
    description: "Мы всегда на связи и готовы помочь",
  },
  {
    icon: "👤",
    title: "Личный менеджер",
    description: "Персональное сопровождение на всех этапах",
  },
  {
    icon: "⚡",
    title: "Быстрая обработка",
    description: "Оперативное рассмотрение документов",
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Services */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Наши услуги</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Полный спектр финансовых услуг для развития вашего бизнеса
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((service) => (
            <Card key={service.title} className="bg-card border-border hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advantages */}
        <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Преимущества работы с нами
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{advantage.icon}</span>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{advantage.title}</h4>
                <p className="text-muted-foreground">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
