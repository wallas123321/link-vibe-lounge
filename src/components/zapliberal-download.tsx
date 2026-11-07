import { Download, LockKeyhole, Bell, UserRound } from "lucide-react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const APK_URL = "https://rydaouudvgqfmkwuzkyu.supabase.co/functions/v1/zapliberal-baixar";

export function ZapLiberalDownload() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="bg-button-gradient group relative flex w-full items-center gap-4 rounded-2xl border border-rose/40 px-5 py-4 text-left shadow-button-elegant transition-all hover:scale-[1.02] hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
        >
          <img src="/zapliberal.svg" alt="" className="h-11 w-11 shrink-0 rounded-xl" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">Baixar ZapLiberal</span>
            <span className="block text-xs text-foreground/80">Nosso grupo privado · Android</span>
          </span>
          <Download className="h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-2xl border-rose/30 bg-background p-6">
        <DialogHeader className="items-center gap-3 text-center sm:text-center">
          <img src="/zapliberal.svg" alt="Logo do ZapLiberal" className="h-20 w-20 rounded-2xl" />
          <DialogTitle className="text-3xl text-foreground">Seu grupo no ZapLiberal</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-foreground/85">
            Um app de conversas privado, no estilo do WhatsApp.
            Sem pedir número de telefone ou e-mail.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 rounded-xl border border-rose/20 bg-card p-4 text-sm">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden="true" />
            <p>Converse no grupo sem expor seu número.</p>
          </div>
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden="true" />
            <p>Instale e preencha seu apelido, homem/mulher/casal, foto de perfil, cidade e estado.</p>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-rose" aria-hidden="true" />
            <p>Ative as notificações para saber quando seu cadastro for aprovado. Depois da aprovação, o grupo é liberado automaticamente. Sem convite.</p>
          </div>
        </div>
        <section aria-labelledby="apk-notice-title" className="space-y-3 rounded-xl border border-rose/35 bg-card p-4 text-sm leading-relaxed text-foreground/90">
          <h3 id="apk-notice-title" className="font-semibold text-foreground">Antes de instalar: entenda o aviso do Android</h3>
          <p>O ZapLiberal é exclusivo para maiores de 18 anos e é distribuído diretamente por este site, em arquivo APK, fora da Google Play.</p>
          <p>Ao baixar, o navegador pode exibir <strong>“Este tipo de arquivo pode danificar seu telefone”</strong>. Esse aviso informa sobre o risco de instalar arquivos desse tipo; ele não significa, por si só, que foi detectado um vírus no ZapLiberal.</p>
          <p>Confira se você iniciou o download por este site e mantenha o Google Play Protect ativado. Se decidir continuar, toque em “Baixar” e siga as instruções do Android para instalar.</p>
          <p className="font-semibold text-rose">Uso exclusivo para maiores de 18 anos</p>
        </section>
        <a
          href={APK_URL}
          className="bg-button-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-button-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Baixar app Android
        </a>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Aplicativo independente para Android · Download do APK.
          Se o Instagram não iniciar o download, abra o link no Chrome.
        </p>
      </DialogContent>
    </Dialog>
  );
}
