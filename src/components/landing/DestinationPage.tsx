import { Link } from "@/i18n/routing";
import styles from "./landingPage.module.css";

type Selection = { label: string; value: string };

type DestinationPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  backLabel: string;
  selectionsTitle?: string;
  selections?: Selection[];
  emptySelection?: string;
};

export default function DestinationPage({
  eyebrow,
  title,
  description,
  status,
  backLabel,
  selectionsTitle,
  selections = [],
  emptySelection,
}: DestinationPageProps) {
  return (
    <section className={styles.destinationPage} data-header-theme="dark">
      <div className={styles.destinationGlow} aria-hidden="true" />
      <div className={styles.destinationCard}>
        <p className={styles.destinationEyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.destinationDescription}>{description}</p>
        <p className={styles.destinationStatus}>{status}</p>

        {selectionsTitle && (
          <div className={styles.selectionSummary}>
            <h2>{selectionsTitle}</h2>
            {selections.length > 0 ? (
              <dl>
                {selections.map((selection) => (
                  <div key={selection.label}>
                    <dt>{selection.label}</dt>
                    <dd>{selection.value}</dd>
                  </div>
                ))}
              </dl>
            ) : <p>{emptySelection}</p>}
          </div>
        )}

        <Link className={styles.destinationCta} href="/">
          <span aria-hidden="true">←</span>{backLabel}
        </Link>
      </div>
    </section>
  );
}

