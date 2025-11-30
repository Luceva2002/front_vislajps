'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function PrivacyPage() {
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
          <h1>Informativa sulla Privacy</h1>
          <p className="text-muted-foreground">
            Ultimo aggiornamento: 1 Febbraio 2024
          </p>

          <h2>1. Introduzione</h2>
          <p>
            VislAJPS ("noi", "nostro" o "Società") si impegna a proteggere la privacy degli utenti. 
            Questa informativa descrive come raccogliamo, utilizziamo e proteggiamo i dati personali.
          </p>

          <h2>2. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati è VislAJPS S.r.l., 
            con sede in Via Roma 1, 20121 Milano (MI), Italia.
          </p>

          <h2>3. Dati Raccolti</h2>
          <p>Raccogliamo le seguenti categorie di dati:</p>
          
          <h3>3.1 Dati di registrazione</h3>
          <ul>
            <li>Nome e cognome</li>
            <li>Indirizzo email</li>
            <li>Numero di telefono</li>
            <li>Nome azienda</li>
          </ul>

          <h3>3.2 Dati dei veicoli</h3>
          <ul>
            <li>Posizione GPS in tempo reale</li>
            <li>Storico dei percorsi</li>
            <li>Dati di telemetria (velocità, direzione, stato motore)</li>
            <li>Eventi e allarmi</li>
          </ul>

          <h3>3.3 Dati di utilizzo</h3>
          <ul>
            <li>Log di accesso</li>
            <li>Indirizzo IP</li>
            <li>Tipo di browser e dispositivo</li>
            <li>Pagine visitate</li>
          </ul>

          <h2>4. Finalità del Trattamento</h2>
          <p>I dati vengono trattati per:</p>
          <ul>
            <li>Fornire i servizi di tracciamento e gestione flotte</li>
            <li>Gestire l'account utente</li>
            <li>Inviare notifiche relative al servizio</li>
            <li>Migliorare i nostri servizi</li>
            <li>Adempiere a obblighi di legge</li>
          </ul>

          <h2>5. Base Giuridica</h2>
          <p>Il trattamento si basa su:</p>
          <ul>
            <li>Esecuzione del contratto di servizio</li>
            <li>Consenso dell'interessato</li>
            <li>Legittimo interesse</li>
            <li>Adempimento di obblighi legali</li>
          </ul>

          <h2>6. Conservazione dei Dati</h2>
          <p>
            I dati di posizione vengono conservati per un periodo massimo di 12 mesi. 
            I dati dell'account vengono conservati per tutta la durata del rapporto contrattuale 
            e per i successivi 10 anni come richiesto dalla legge.
          </p>

          <h2>7. Condivisione dei Dati</h2>
          <p>I dati possono essere condivisi con:</p>
          <ul>
            <li>Fornitori di servizi tecnologici</li>
            <li>Autorità competenti quando richiesto dalla legge</li>
            <li>Altri utenti dell'account aziendale, se autorizzati</li>
          </ul>

          <h2>8. Diritti dell'Interessato</h2>
          <p>L'utente ha diritto a:</p>
          <ul>
            <li>Accedere ai propri dati</li>
            <li>Rettificare dati inesatti</li>
            <li>Cancellare i dati (diritto all'oblio)</li>
            <li>Limitare il trattamento</li>
            <li>Portabilità dei dati</li>
            <li>Opporsi al trattamento</li>
            <li>Revocare il consenso</li>
          </ul>

          <h2>9. Sicurezza</h2>
          <p>
            Adottiamo misure tecniche e organizzative appropriate per proteggere i dati, tra cui:
          </p>
          <ul>
            <li>Crittografia dei dati in transito e a riposo</li>
            <li>Controlli di accesso basati sui ruoli</li>
            <li>Monitoraggio delle attività</li>
            <li>Backup regolari</li>
          </ul>

          <h2>10. Cookie</h2>
          <p>
            Utilizziamo cookie tecnici necessari per il funzionamento del servizio 
            e cookie analitici per migliorare l'esperienza utente. 
            Per maggiori informazioni, consulta la nostra Cookie Policy.
          </p>

          <h2>11. Trasferimento Dati</h2>
          <p>
            I dati potrebbero essere trasferiti in paesi al di fuori dell'UE. 
            In tal caso, garantiamo che il trasferimento avvenga nel rispetto del GDPR, 
            attraverso clausole contrattuali standard o altre garanzie appropriate.
          </p>

          <h2>12. Modifiche all'Informativa</h2>
          <p>
            Ci riserviamo il diritto di modificare questa informativa. 
            Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento.
          </p>

          <h2>13. Contatti</h2>
          <p>
            Per esercitare i tuoi diritti o per domande sulla privacy, contattaci:
          </p>
          <ul>
            <li>
              Email:{' '}
              <a href="mailto:privacy@vislajps.com" className="text-primary hover:underline">
                privacy@vislajps.com
              </a>
            </li>
            <li>
              DPO:{' '}
              <a href="mailto:dpo@vislajps.com" className="text-primary hover:underline">
                dpo@vislajps.com
              </a>
            </li>
          </ul>

          <h2>14. Reclami</h2>
          <p>
            Hai il diritto di proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali 
            (www.garanteprivacy.it) se ritieni che il trattamento dei tuoi dati violi la normativa applicabile.
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

