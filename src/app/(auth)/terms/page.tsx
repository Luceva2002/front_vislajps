'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/login" className="flex items-center gap-2">
            <Logo showText={true} size="sm" />
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al login
            </Link>
          </Button>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1>Termini e Condizioni di Servizio</h1>
          <p className="text-muted-foreground">
            Ultimo aggiornamento: 1 Febbraio 2024
          </p>

          <h2>1. Accettazione dei Termini</h2>
          <p>
            Utilizzando il servizio VislAJPS, l'utente accetta di essere vincolato dai presenti Termini e Condizioni. 
            Se non si accettano questi termini, si prega di non utilizzare il servizio.
          </p>

          <h2>2. Descrizione del Servizio</h2>
          <p>
            VislAJPS è una piattaforma di gestione flotte e tracciamento veicoli che consente di:
          </p>
          <ul>
            <li>Monitorare la posizione dei veicoli in tempo reale</li>
            <li>Visualizzare lo storico dei percorsi</li>
            <li>Configurare geofence e notifiche</li>
            <li>Generare report dettagliati</li>
            <li>Gestire la manutenzione dei veicoli</li>
          </ul>

          <h2>3. Account Utente</h2>
          <p>
            Per utilizzare il servizio è necessario creare un account. L'utente è responsabile di:
          </p>
          <ul>
            <li>Mantenere la riservatezza delle proprie credenziali</li>
            <li>Tutte le attività che si verificano con il proprio account</li>
            <li>Notificare immediatamente qualsiasi uso non autorizzato</li>
          </ul>

          <h2>4. Uso Accettabile</h2>
          <p>
            L'utente si impegna a non utilizzare il servizio per:
          </p>
          <ul>
            <li>Violare leggi o regolamenti applicabili</li>
            <li>Tracciare veicoli senza il consenso dei proprietari</li>
            <li>Interferire con il funzionamento del servizio</li>
            <li>Tentare di accedere a dati di altri utenti</li>
          </ul>

          <h2>5. Privacy e Dati</h2>
          <p>
            Il trattamento dei dati personali è regolato dalla nostra{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Informativa sulla Privacy
            </Link>
            . Utilizzando il servizio, l'utente acconsente al trattamento dei propri dati come descritto.
          </p>

          <h2>6. Proprietà Intellettuale</h2>
          <p>
            Tutti i contenuti del servizio, inclusi software, grafica, testi e marchi, 
            sono di proprietà di VislAJPS o dei suoi licenzianti e sono protetti dalle leggi sulla proprietà intellettuale.
          </p>

          <h2>7. Limitazione di Responsabilità</h2>
          <p>
            Il servizio viene fornito "così com'è". VislAJPS non garantisce che il servizio sia privo di errori 
            o interruzioni. Non siamo responsabili per eventuali danni derivanti dall'uso del servizio.
          </p>

          <h2>8. Modifiche ai Termini</h2>
          <p>
            Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
            Le modifiche saranno comunicate agli utenti e l'uso continuato del servizio costituisce accettazione dei nuovi termini.
          </p>

          <h2>9. Risoluzione</h2>
          <p>
            Possiamo sospendere o terminare l'accesso al servizio in caso di violazione di questi termini, 
            con o senza preavviso.
          </p>

          <h2>10. Legge Applicabile</h2>
          <p>
            Questi termini sono regolati dalla legge italiana. 
            Per qualsiasi controversia sarà competente il Foro di Milano.
          </p>

          <h2>11. Contatti</h2>
          <p>
            Per domande relative a questi termini, contattaci all'indirizzo:{' '}
            <a href="mailto:legal@vislajps.com" className="text-primary hover:underline">
              legal@vislajps.com
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 VislAJPS. Tutti i diritti riservati.</p>
        </div>
      </div>
    </div>
  );
}

