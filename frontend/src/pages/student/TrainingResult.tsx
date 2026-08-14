import { useLocation, useNavigate } from 'react-router-dom'

export default function TrainingResult() {
  const { state } = useLocation() as any; const navigate = useNavigate(); const result = state?.result
  if (!result) return <div style={{padding:32}}>No result available.</div>
  return <div style={{padding:40,maxWidth:760,margin:'0 auto'}}>
    <div style={{textAlign:'center'}}><h1>Training complete</h1><p style={{fontSize:30,fontWeight:800,color:'#2563EB'}}>{result.score} / {result.scoreMaximum}</p><p>{result.bonnesReponses} correct answers out of {result.totalQuestions} ({result.pourcentage}%)</p></div>
    <div style={{display:'grid',gap:10,margin:'24px 0'}}>{result.questions?.map((question:any,index:number)=><div key={question.questionId} style={{padding:14,borderRadius:10,border:`1px solid ${question.correcte?'#86EFAC':'#FCA5A5'}`,background:question.correcte?'#F0FDF4':'#FEF2F2'}}><strong>{index+1}. {question.correcte?'Correct':'Incorrect'}</strong><span style={{float:'right'}}>{question.pointsObtenus} points</span>{question.explication&&<p style={{marginBottom:0,color:'#475569'}}>{question.explication}</p>}</div>)}</div>
    <button onClick={()=>navigate('/student/training')} style={{width:'100%',padding:'12px 20px',border:0,borderRadius:9,background:'#2563EB',color:'#fff',fontWeight:700}}>Back to training</button>
  </div>
}
