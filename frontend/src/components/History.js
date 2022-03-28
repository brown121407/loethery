export default function() {
  const pastRounds = [
    {
      name: 'Super mega extragerea!!!',
      startDate: new Date(),
      endDate: new Date(),
      winners: [
        "0x19aCd555DB36BC7F8039d1022555cbB554750043",
        "0x19aCd555DB36BC7F8039d1022555cbB554750044"
      ]
    },
    {
      name: 'Ceva extragere normala.',
      startDate: new Date(),
      endDate: new Date(),
      winners: [
        "0x19aCd555DB36BC7F8039d1022555cbB554750043",
        "0x19aCd555DB36BC7F8039d1022555cbB554750044"
      ]
    }
  ];

  return (
    <div className="card divide-y divide-solid dark:divide-slate-600">
      <h2 className="text-3xl font-bold px-4 py-2 dark:text-slate-50">Past Rounds</h2>
      <div className="divide-y divide-dashed dark:divide-slate-600">
        { pastRounds.length > 0
        ? pastRounds.map((round, i) => 
            <div className="px-4 py-2 overflow-x-auto" key={i}>
              <h3 className="text-2xl dark:text-slate-50">{round.name}</h3>
              <dl>
                <dt className="my-1">When:</dt>
                <dd className="ml-4 my-1">{round.startDate.toLocaleString()} &ndash; {round.endDate.toLocaleString()}</dd>
                <dt className="my-1">1<sup>st</sup> pick:</dt>
                <dd className="font-mono ml-4">{round.winners[0]}</dd>
                <dt className="my-1">2<sup>nd</sup> pick:</dt>
                <dd className="font-mono ml-4">{round.winners[0]}</dd>
              </dl>
            </div> 
          )
        : <p className="px-4 py-2">No rounds have been played yet.</p>
        }
      </div>
    </div>
  );
}