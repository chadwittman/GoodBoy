
const EXAMPLES = [
  "Wife's birthday, $150, she loves Mejuri and Aritzia",
  "Mom's Mother's Day, $80, she's really into gardening",
  "Anniversary dinner reservation, this Saturday, Chicago",
  "Girlfriend surprise, $200, she's obsessed with skincare",
  "Send my mom flowers, her birthday is next week",
]

export default function ExampleChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="mb-4">
      <p className="text-zinc-500 text-xs mb-3 text-center uppercase tracking-widest">Try an example</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => onSelect(ex)}
            className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 hover:border-amber-500/60 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
