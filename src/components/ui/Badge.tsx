import clsx from 'clsx'

type Tone = 'success' | 'pending' | 'neutral' | 'info'

const tones: Record<Tone, string> = {
  success: 'bg-verde-salvia text-cinza-ameixa',
  pending: 'bg-coral-suave text-cinza-ameixa',
  neutral: 'bg-lilas-suave text-cinza-ameixa',
  info: 'bg-amarelo-manteiga text-cinza-ameixa',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={clsx('inline-block rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  )
}
