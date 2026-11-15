(() => {
  'use strict';
  const lessons = window.MATH_LESSONS || [];
  const list = document.querySelector('#unit-list');
  const view = document.querySelector('#lesson');
  const el = (tag, text, className) => {const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
  const panel = (title) => {const section=el('section',undefined,'panel');section.append(el('h3',title));view.append(section);return section;};
  const items = (parent, values, ordered=false) => {const ul=el(ordered?'ol':'ul');values.forEach(s=>ul.append(el('li',s)));parent.append(ul);};
  lessons.forEach(lesson=>{
    const card=el('article',undefined,'card');card.append(el('span',lesson.grade,'tag'),el('h3',lesson.title),el('p',lesson.description));
    const btn=el('button','開始學習');btn.addEventListener('click',()=>showLesson(lesson));card.append(btn);list.append(card);
  });
  function showLesson(l){
    view.replaceChildren();view.classList.remove('hidden');
    const heading=panel(`${l.title}｜${l.grade}`);heading.append(el('p',l.category));
    panel('一、核心概念').append(el('p',l.concept));
    const formula=panel('二、重要公式與解題原則');l.formulas.forEach(f=>formula.append(el('div',f,'math')));items(formula,l.principles);
    const example=panel('三、範例解析');example.append(el('p',`題目：${l.example.question}`,'math'));items(example,l.example.steps,true);example.append(el('strong',`正確答案：${l.example.answer}`));
    const practice=panel('四、互動練習題');practice.append(el('p','輸入 x 的數值，點選批改答案。'));
    const inputs=[];const feedbacks=[];
    l.exercises.forEach((q,i)=>{
      const area=el('div',undefined,'exercise');area.append(el('strong',`第 ${i+1} 題`),el('div',q.question,'math'));
      const label=el('label','x = ');const input=el('input');input.type='number';input.step='any';input.setAttribute('aria-label',`第 ${i+1} 題答案`);label.append(input);area.append(label);
      const toggle=el('button','查看解析','secondary');toggle.style.marginLeft='10px';const answer=el('div',undefined,'answer hidden');items(answer,q.steps,true);toggle.addEventListener('click',()=>{answer.classList.toggle('hidden');toggle.textContent=answer.classList.contains('hidden')?'查看解析':'收起解析';});area.append(toggle,answer);
      const feedback=el('div',undefined,'feedback');area.append(feedback);practice.append(area);inputs.push(input);feedbacks.push(feedback);
    });
    const gradeBtn=el('button','批改答案');const result=el('p');gradeBtn.addEventListener('click',()=>{
      let score=0;l.exercises.forEach((q,i)=>{const raw=inputs[i].value.trim();const ok=raw!==''&&Number(raw)===q.answer;if(ok)score++;feedbacks[i].textContent=raw===''?'尚未作答':ok?'回答正確！':'答案不正確，請再試一次。';feedbacks[i].className=`feedback ${ok?'correct':'incorrect'}`;});result.textContent=`本次答對 ${score} / ${l.exercises.length} 題。${score===l.exercises.length?'全部答對，做得很好！':'可查看解析後再次練習。'}`;
    });practice.append(gradeBtn,result);
    const mistakes=panel('五、常見錯誤提醒');items(mistakes,l.mistakes);
    const summary=panel('六、學習重點整理');l.summary.forEach((s,i)=>{const label=el('label');label.style.display='block';const check=el('input');check.type='checkbox';check.id=`goal-${i}`;label.append(check,document.createTextNode(` ${s}`));summary.append(label);});
    view.scrollIntoView({behavior:'smooth',block:'start'});
  }
  if(!lessons.length)list.append(el('p','目前尚無數學單元。'));
})();
