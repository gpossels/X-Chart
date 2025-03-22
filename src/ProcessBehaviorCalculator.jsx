import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const ProcessBehaviorCalculator = () => {
  const [dataPoints, setDataPoints] = useState([{ value: '' }]);
  const [results, setResults] = useState(null);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(1);
  const [timeUnit, setTimeUnit] = useState('month'); // 'month' or 'week'
  const [language, setLanguage] = useState('es'); // 'en' for English, 'es' for Spanish
  const [thresholds, setThresholds] = useState([{ value: '', label: '' }]);
  const [showThresholds, setShowThresholds] = useState(false);
  const textAreaRef = useRef(null);
  
  // Translations
  const translations = {
    en: {
      title: 'Process Behavior Calculator',
      timeUnit: 'Time Unit',
      months: 'Months',
      weeks: 'Weeks',
      startMonth: 'Start Month',
      startWeek: 'Start Week',
      startYear: 'Start Year',
      dataPoints: 'Data Points',
      bulkPaste: 'Bulk Paste (one value per line or comma/tab separated):',
      pasteDataPlaceholder: 'Paste data points here...',
      individualDataPoints: 'Individual Data Points:',
      value: 'Value',
      remove: 'Remove',
      add: 'Add Data Point',
      calculate: 'Calculate',
      results: 'Results',
      result: 'Result:',
      download: 'Download as CSV',
      baselineEstablished: 'Baseline established with first 8 data points',
      notEnoughData: 'Not enough data. Need at least 8 data points.',
      rule1Triggered: 'Rule 1 triggered: Data point outside control limits and MR > MRUCL',
      rule2Triggered: 'Rule 2 triggered: All last 8 data points above or below DPA',
      rule3Triggered: 'Rule 3 triggered: At least 3 of last 4 data points above DUA or below DLA',
      dpa: 'Data Points Average (DPA)',
      mra: 'Moving Range Average (MRA)',
      lcl: 'Lower Control Limit (LCL)',
      dla: 'DPA-LCL Average (DLA)',
      dua: 'DPA-UCL Average (DUA)',
      ucl: 'Upper Control Limit (UCL)',
      mrucl: 'Moving Range Upper Control Limit (MRUCL)',
      dataPoint: 'Data Point',
      movingRange: 'Moving Range (MR)',
      ruleApplied: 'Rule Applied',
      signal: 'Signal',
      thresholds: 'Threshold Lines',
      addThreshold: 'Add Threshold',
      thresholdValue: 'Value',
      thresholdLabel: 'Label',
      removeThreshold: 'Remove',
      toggleThresholds: 'Show/Hide Thresholds'
    },
    es: {
      title: 'Calculadora de Comportamiento de Proceso',
      timeUnit: 'Unidad de Tiempo',
      months: 'Meses',
      weeks: 'Semanas',
      startMonth: 'Mes de Inicio',
      startWeek: 'Semana de Inicio',
      startYear: 'Año de Inicio',
      dataPoints: 'Datos',
      bulkPaste: 'Pega la columna de datos (un valor por línea, o separado por coma o tecla de tabulación):',
      pasteDataPlaceholder: 'Pega los datos aquí...',
      individualDataPoints: 'Datos Individuales:',
      value: 'Valor',
      remove: 'Eliminar',
      add: 'Añadir Dato',
      calculate: 'Calcular',
      results: 'Resultados',
      result: 'Resultado:',
      download: 'Descargar como CSV',
      baselineEstablished: 'Línea base establecida con los primeros 8 puntos de datos',
      notEnoughData: 'Datos insuficientes. Se necesitan al menos 8 puntos de datos.',
      rule1Triggered: 'Regla 1 activada: Punto de datos fuera de los límites de control y MR > MRUCL',
      rule2Triggered: 'Regla 2 activada: Todos los últimos 8 puntos de datos están por encima o por debajo del DPA',
      rule3Triggered: 'Regla 3 activada: Al menos 3 de los últimos 4 puntos de datos están por encima del DUA o por debajo del DLA',
      dpa: 'Promedio de Puntos de Datos (DPA)',
      mra: 'Promedio de Rangos Móviles (MRA)',
      lcl: 'Límite de Control Inferior (LCL)',
      dla: 'Promedio DPA-LCL (DLA)',
      dua: 'Promedio DPA-UCL (DUA)',
      ucl: 'Límite de Control Superior (UCL)',
      mrucl: 'Límite de Control Superior del Rango Móvil (MRUCL)',
      dataPoint: 'Punto de Datos',
      movingRange: 'Rango Móvil (MR)',
      ruleApplied: 'Regla Aplicada',
      signal: 'Señal',
      thresholds: 'Líneas de Umbral',
      addThreshold: 'Añadir Umbral',
      thresholdValue: 'Valor',
      thresholdLabel: 'Etiqueta',
      removeThreshold: 'Eliminar',
      toggleThresholds: 'Mostrar/Ocultar Umbrales'
    }
  };
  
  // Get current language text
  const t = translations[language];
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };
  
  // Add a new empty data point
  const addDataPoint = () => {
    setDataPoints([...dataPoints, { value: '' }]);
  };
  
  // Handle changes to data point inputs
  const handleDataPointChange = (index, value) => {
    const newDataPoints = [...dataPoints];
    newDataPoints[index].value = value;
    setDataPoints(newDataPoints);
  };
  
  // Remove a data point
  const removeDataPoint = (index) => {
    if (dataPoints.length > 1) {
      const newDataPoints = [...dataPoints];
      newDataPoints.splice(index, 1);
      setDataPoints(newDataPoints);
    }
  };
  
  // Add a new threshold line
  const addThreshold = () => {
    setThresholds([...thresholds, { value: '', label: '' }]);
  };
  
  // Handle changes to threshold inputs
  const handleThresholdChange = (index, field, value) => {
    const newThresholds = [...thresholds];
    newThresholds[index][field] = value;
    setThresholds(newThresholds);
  };
  
  // Remove a threshold
  const removeThreshold = (index) => {
    if (thresholds.length > 1) {
      const newThresholds = [...thresholds];
      newThresholds.splice(index, 1);
      setThresholds(newThresholds);
    }
  };
  
  // Toggle showing thresholds
  const toggleThresholds = () => {
    setShowThresholds(!showThresholds);
  };

  // Handle bulk paste of data points
  const handleBulkPaste = (e) => {
    const pastedText = e.target.value;
    const lines = pastedText.split(/[\n\r,\t]+/).filter(line => line.trim() !== '');
    
    if (lines.length > 0) {
      const newDataPoints = lines.map(line => ({ 
        value: line.trim() 
      }));
      setDataPoints(newDataPoints);
    }
  };
  
  // Calculate SPC (Statistical Process Control)
  const calculateSPC = (validDataPoints) => {
    // Make sure we have enough data points
    if (validDataPoints.length < 8) {
      return {
        error: t.notEnoughData
      };
    }
    
    // Initial data structure to hold all calculated values
    let spcData = validDataPoints.map((point, index) => {
      return {
        index: index,
        dataPoint: point.value,
        movingRange: index > 0 ? Math.abs(point.value - validDataPoints[index - 1].value).toFixed(2) : "-",
        dpa: null,
        mra: null,
        lcl: null,
        dla: null,
        dua: null,
        ucl: null,
        mrucl: null,
        ruleApplied: null,
        signal: null
      };
    });
    
    // First calculate the baseline using first 8 data points
    const baselineData = spcData.slice(0, 8);
    const baselineDP = baselineData.map(d => d.dataPoint);
    
    // 1. Calculate DPA (Data Points Average)
    const dpa = baselineDP.reduce((sum, val) => sum + val, 0) / baselineDP.length;
    
    // 2. Calculate MRs (Moving Ranges) and collect for MRA
    const baselineMRs = [];
    for (let i = 1; i < baselineData.length; i++) {
      const mr = Math.abs(baselineDP[i] - baselineDP[i-1]);
      baselineMRs.push(Number(mr.toFixed(2)));
      spcData[i].movingRange = mr.toFixed(2);
    }
    
    // 3. Calculate MRA (Moving Range Average)
    const mra = baselineMRs.reduce((sum, val) => sum + val, 0) / baselineMRs.length;
    
    // 4. Calculate control limits
    const lcl = dpa - (mra * 3/1.128);
    const ucl = dpa + (mra * 3/1.128);
    const mrucl = mra * 3.27;
    const dla = (lcl + dpa) / 2;
    const dua = (dpa + ucl) / 2;
    
    // 5. Set baseline values for first 8 data points
    for (let i = 0; i < 8; i++) {
      spcData[i].dpa = dpa.toFixed(2);
      spcData[i].mra = mra.toFixed(2);
      spcData[i].lcl = lcl.toFixed(2);
      spcData[i].dla = dla.toFixed(2);
      spcData[i].dua = dua.toFixed(2);
      spcData[i].ucl = ucl.toFixed(2);
      spcData[i].mrucl = mrucl.toFixed(2);
      spcData[i].ruleApplied = "Baseline";
    }
    
    // Process remaining data points (after baseline)
    let messages = [{
      en: 'Baseline established with first 8 data points',
      es: 'Línea base establecida con los primeros 8 puntos de datos'
    }];
    
    for (let i = 8; i < spcData.length; i++) {
      const currentDP = spcData[i].dataPoint;
      const previousDP = spcData[i-1].dataPoint;
      
      // Calculate MR for current row
      const currentMR = Math.abs(currentDP - previousDP);
      spcData[i].movingRange = currentMR.toFixed(2);
      
      // Get control limits from previous row
      const previousDPA = Number(spcData[i-1].dpa);
      const previousMRA = Number(spcData[i-1].mra);
      const previousLCL = Number(spcData[i-1].lcl);
      const previousDLA = Number(spcData[i-1].dla);
      const previousDUA = Number(spcData[i-1].dua);
      const previousUCL = Number(spcData[i-1].ucl);
      const previousMRUCL = Number(spcData[i-1].mrucl);
      
      // Initialize rule flags
      let rule1Triggered = false;
      let rule2Triggered = false;
      let rule3Triggered = false;
      
      // Check Rule 1: DP outside control limits AND MR > MRUCL
      if ((currentDP > previousUCL || currentDP < previousLCL) && currentMR > previousMRUCL) {
        rule1Triggered = true;
        spcData[i].signal = 1;
        messages.push({
          en: 'Rule 1 triggered: Data point outside control limits and MR > MRUCL',
          es: 'Regla 1 activada: Punto de datos fuera de los límites de control y MR > MRUCL'
        });
      }
      
      // Check Rule 2: All 8 recent DPs above or below DPA
      // Get the last 8 DPs (including current)
      const lastEightDPs = spcData.slice(i-7, i+1).map(d => d.dataPoint);
      
      // Check if all 8 DPs are above or all below previous DPA
      const allAboveDPA = lastEightDPs.every(dp => dp > previousDPA);
      const allBelowDPA = lastEightDPs.every(dp => dp < previousDPA);
      
      if (allAboveDPA || allBelowDPA) {
        rule2Triggered = true;
        messages.push({
          en: 'Rule 2 triggered: All last 8 data points above or below DPA',
          es: 'Regla 2 activada: Todos los últimos 8 puntos de datos están por encima o por debajo del DPA'
        });
        
        // Calculate new values based on last 8 DPs
        // 1. New DPA
        const newDPA = lastEightDPs.reduce((sum, val) => sum + val, 0) / 8;
        
        // 2. New MRA
        const lastEightMRs = spcData.slice(i-7, i+1).map(d => Number(d.movingRange)).filter(mr => !isNaN(mr));
        const newMRA = lastEightMRs.reduce((sum, val) => sum + val, 0) / lastEightMRs.length;
        
        // 3. Calculate new control limits
        const newLCL = newDPA - (newMRA * 3/1.128);
        const newUCL = newDPA + (newMRA * 3/1.128);
        const newMRUCL = newMRA * 3.27;
        const newDLA = (newLCL + newDPA) / 2;
        const newDUA = (newDPA + newUCL) / 2;
        
        // Set the calculated values for current row
        spcData[i].dpa = newDPA.toFixed(2);
        spcData[i].mra = newMRA.toFixed(2);
        spcData[i].lcl = newLCL.toFixed(2);
        spcData[i].dla = newDLA.toFixed(2);
        spcData[i].dua = newDUA.toFixed(2);
        spcData[i].ucl = newUCL.toFixed(2);
        spcData[i].mrucl = newMRUCL.toFixed(2);
        spcData[i].ruleApplied = "Rule 2";
        
        // Update the previous 7 rows with new values
        for (let j = i-7; j < i; j++) {
          spcData[j].dpa = newDPA.toFixed(2);
          spcData[j].mra = newMRA.toFixed(2);
          spcData[j].lcl = newLCL.toFixed(2);
          spcData[j].dla = newDLA.toFixed(2);
          spcData[j].dua = newDUA.toFixed(2);
          spcData[j].ucl = newUCL.toFixed(2);
          spcData[j].mrucl = newMRUCL.toFixed(2);
          spcData[j].ruleApplied = "Rule 2";
        }
      } 
      // Only check Rule 3 if Rule 2 is not triggered
      else {
        // Check Rule 3: At least 3 of last 4 DPs above DUA or below DLA
        const lastFourDPs = spcData.slice(i-3, i+1).map(d => d.dataPoint);
        
        // Count DPs above DUA and below DLA
        const aboveDUACount = lastFourDPs.filter(dp => dp > previousDUA).length;
        const belowDLACount = lastFourDPs.filter(dp => dp < previousDLA).length;
        
        if (aboveDUACount >= 3 || belowDLACount >= 3) {
          rule3Triggered = true;
          messages.push({
            en: 'Rule 3 triggered: At least 3 of last 4 data points above DUA or below DLA',
            es: 'Regla 3 activada: Al menos 3 de los últimos 4 puntos de datos están por encima del DUA o por debajo del DLA'
          });
          
          // Calculate new values based on last 4 DPs
          // 1. New DPA
          const newDPA = lastFourDPs.reduce((sum, val) => sum + val, 0) / 4;
          
          // 2. New MRA
          const lastFourMRs = spcData.slice(i-3, i+1).map(d => Number(d.movingRange)).filter(mr => !isNaN(mr));
          const newMRA = lastFourMRs.reduce((sum, val) => sum + val, 0) / lastFourMRs.length;
          
          // 3. Calculate new control limits
          const newLCL = newDPA - (newMRA * 3/1.128);
          const newUCL = newDPA + (newMRA * 3/1.128);
          const newMRUCL = newMRA * 3.27;
          const newDLA = (newLCL + newDPA) / 2;
          const newDUA = (newDPA + newUCL) / 2;
          
          // Set the calculated values for current row
          spcData[i].dpa = newDPA.toFixed(2);
          spcData[i].mra = newMRA.toFixed(2);
          spcData[i].lcl = newLCL.toFixed(2);
          spcData[i].dla = newDLA.toFixed(2);
          spcData[i].dua = newDUA.toFixed(2);
          spcData[i].ucl = newUCL.toFixed(2);
          spcData[i].mrucl = newMRUCL.toFixed(2);
          spcData[i].ruleApplied = "Rule 3";
          
          // Update the previous 3 rows with new values
          for (let j = i-3; j < i; j++) {
            spcData[j].dpa = newDPA.toFixed(2);
            spcData[j].mra = newMRA.toFixed(2);
            spcData[j].lcl = newLCL.toFixed(2);
            spcData[j].dla = newDLA.toFixed(2);
            spcData[j].dua = newDUA.toFixed(2);
            spcData[j].ucl = newUCL.toFixed(2);
            spcData[j].mrucl = newMRUCL.toFixed(2);
            spcData[j].ruleApplied = "Rule 3";
          }
        } 
        // If no rules are triggered, copy the previous row's values
        else {
          spcData[i].dpa = previousDPA.toFixed(2);
          spcData[i].mra = previousMRA.toFixed(2);
          spcData[i].lcl = previousLCL.toFixed(2);
          spcData[i].dla = previousDLA.toFixed(2);
          spcData[i].dua = previousDUA.toFixed(2);
          spcData[i].ucl = previousUCL.toFixed(2);
          spcData[i].mrucl = previousMRUCL.toFixed(2);
          spcData[i].ruleApplied = spcData[i-1].ruleApplied;
        }
      }
    }
    
    return {
      spcData: spcData,
      messages: messages
    };
  };
  
  // Calculate results based on the data points
  const calculateResults = () => {
    // Convert string inputs to numbers
    const validDataPoints = dataPoints
      .filter(point => point.value !== '' && !isNaN(point.value))
      .map(point => ({ value: Number(point.value) }));
    
    if (validDataPoints.length === 0) {
      alert('Please enter valid data points');
      return;
    }
    
    // Process valid thresholds
    const validThresholds = thresholds
      .filter(threshold => threshold.value !== '' && !isNaN(threshold.value))
      .map((threshold, index) => ({
        value: Number(threshold.value),
        label: threshold.label || (language === 'en' ? `Threshold ${index + 1}` : `Umbral ${index + 1}`)
      }));
    
    // Generate time periods (months or weeks) based on start date and number of data points
    const timeData = validDataPoints.map((point, index) => {
      let period, year, label;
      
      if (timeUnit === 'month') {
        // Calculate month and year
        const monthsToAdd = index;
        const totalMonths = startMonth - 1 + monthsToAdd;
        year = startYear + Math.floor(totalMonths / 12);
        period = (totalMonths % 12) + 1;
        label = `${year}-${period.toString().padStart(2, '0')}`;
      } else {
        // Calculate week and year
        const weeksToAdd = index;
        const totalWeeks = startMonth + weeksToAdd; // startMonth is being used as startWeek in this case
        year = startYear + Math.floor(totalWeeks / 52);
        period = (totalWeeks % 52) || 52; // Week 0 should be displayed as week 52
        label = `${year}-W${period.toString().padStart(2, '0')}`;
      }
      
      return {
        index,
        year,
        period,
        label
      };
    });
    
    // Calculate SPC
    const spcResult = calculateSPC(validDataPoints);
    
    // If there's an error, show it and return
    if (spcResult.error) {
      alert(spcResult.error);
      return;
    }
    
    // Combine time data with SPC data
    const combinedData = timeData.map((time, index) => {
      return {
        ...time,
        ...spcResult.spcData[index]
      };
    });
    
    // Find signal points for highlighting
    const signalPoints = combinedData
      .filter(point => point.signal === 1)
      .map(point => point.index);
    
    // Prepare chart data (showing data points and control limits)
    const chartData = combinedData.map(item => ({
      label: item.label,
      dataPoint: item.dataPoint,
      lcl: item.lcl ? Number(item.lcl) : null,
      ucl: item.ucl ? Number(item.ucl) : null,
      dpa: item.dpa ? Number(item.dpa) : null,
      dla: item.dla ? Number(item.dla) : null,
      dua: item.dua ? Number(item.dua) : null,
      signal: item.signal,
      index: item.index
    }));
    
    setResults({
      spcData: spcResult.spcData,
      combinedData: combinedData,
      chartData: chartData,
      messages: spcResult.messages,
      thresholds: validThresholds,
      signalPoints: signalPoints
    });
  };
  
  // Generate CSV content for download
  const generateCSV = () => {
    if (!results) return '';
    
    // Create headers
    let csv = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O\n';
    
    // Add header row
    csv += `No.,${t.startYear},${timeUnit === 'month' ? t.startMonth : t.startWeek},`;
    csv += `${t.dataPoint},${t.dpa},${t.movingRange},${t.mra},`;
    csv += `${t.lcl},${t.dla},${t.dua},${t.ucl},${t.mrucl},`;
    csv += `${t.ruleApplied},,${t.signal}\n`;
    
    // Add data rows
    results.combinedData.forEach((point, index) => {
      csv += `${index+1},${point.year},${point.period},`;
      csv += `${point.dataPoint},${point.dpa},${point.movingRange},${point.mra},`;
      csv += `${point.lcl},${point.dla},${point.dua},${point.ucl},${point.mrucl},`;
      csv += `${point.ruleApplied || ""},,${point.signal || ""}\n`;
    });
    
    return csv;
  };
  
  // Handle download of CSV file
  const handleDownload = () => {
    if (!results) return;
    
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'proceso_resultados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <button 
          onClick={toggleLanguage}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          {language === 'en' ? 'Español' : 'English'}
        </button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.timeUnit}:
            <select 
              value={timeUnit} 
              onChange={(e) => setTimeUnit(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="month">{t.months}</option>
              <option value="week">{t.weeks}</option>
            </select>
          </label>
        </div>
        
        <div>
          {timeUnit === 'month' ? (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.startMonth}:
              <select 
                value={startMonth} 
                onChange={(e) => setStartMonth(parseInt(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString(language === 'en' ? 'en-US' : 'es-ES', { month: 'long' })}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.startWeek}:
              <input
                type="number"
                min="1"
                max="52"
                value={startMonth}
                onChange={(e) => setStartMonth(parseInt(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </label>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.startYear}:
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.thresholds}:
            <button
              onClick={toggleThresholds}
              className="ml-2 p-1 bg-yellow-500 text-white rounded-md text-xs"
            >
              {t.toggleThresholds}
            </button>
          </label>
          
          {showThresholds && (
            <div className="mt-2 p-3 border border-gray-300 rounded-md">
              {thresholds.map((threshold, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="mr-2 flex-1">
                    <input
                      type="number"
                      value={threshold.value}
                      onChange={(e) => handleThresholdChange(index, 'value', e.target.value)}
                      placeholder={t.thresholdValue}
                      className="p-className="p-2 border border-gray-300 rounded-md shadow-sm w-full"
                    />
                  </div>
                  <div className="mr-2 flex-1">
                    <input
                      type="text"
                      value={threshold.label}
                      onChange={(e) => handleThresholdChange(index, 'label', e.target.value)}
                      placeholder={t.thresholdLabel}
                      className="p-2 border border-gray-300 rounded-md shadow-sm w-full"
                    />
                  </div>
                  <button
                    onClick={() => removeThreshold(index)}
                    className="p-1 bg-red-500 text-white rounded-md text-xs"
                    disabled={thresholds.length <= 1}
                  >
                    {t.removeThreshold}
                  </button>
                </div>
              ))}
              <button
                onClick={addThreshold}
                className="mt-2 p-1 bg-blue-500 text-white rounded-md text-xs"
              >
                {t.addThreshold}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">{t.dataPoints}</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.bulkPaste}
            <textarea
              ref={textAreaRef}
              onChange={handleBulkPaste}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24"
              placeholder={t.pasteDataPlaceholder}
            />
          </label>
        </div>
        
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">{t.individualDataPoints}</h3>
          {dataPoints.map((point, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="mr-2">
                <span className="text-sm text-gray-500 mr-2">
                  {timeUnit === 'month' 
                    ? new Date(startYear, startMonth - 1 + index, 1).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'short' })
                    : `${startYear + Math.floor((startMonth + index - 1) / 52)}-W${((startMonth + index - 1) % 52) + 1}`
                  }:
                </span>
                <input
                  type="number"
                  value={point.value}
                  onChange={(e) => handleDataPointChange(index, e.target.value)}
                  placeholder={t.value}
                  className="p-2 border border-gray-300 rounded-md shadow-sm w-24"
                />
              </div>
              <button
                onClick={() => removeDataPoint(index)}
                className="p-2 bg-red-500 text-white rounded-md"
                disabled={dataPoints.length <= 1}
              >
                {t.remove}
              </button>
            </div>
          ))}
          <button
            onClick={addDataPoint}
            className="mt-2 p-2 bg-blue-500 text-white rounded-md"
          >
            {t.add}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={calculateResults}
          className="p-2 bg-green-600 text-white rounded-md"
        >
          {t.calculate}
        </button>
      </div>
      
      {results && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">{t.results}</h2>
          
          {/* Messages */}
          <div className="mb-4 p-3 bg-gray-100 rounded">
            {results.messages.map((message, index) => (
              <p key={index} className="mb-1">{message[language]}</p>
            ))}
          </div>
          
          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <ReferenceLine y={0} stroke="#000000" strokeWidth={1} />
                <Tooltip />
                <Legend />
                
                {/* Add translucent red columns for signal points */}
                {results.signalPoints && results.signalPoints.map((pointIndex) => {
                  const point = results.chartData.find(p => p.index === pointIndex);
                  if (point) {
                    return (
                      <ReferenceArea 
                        key={`signal-${pointIndex}`}
                        x1={point.label} 
                        x2={point.label}
                        strokeOpacity={0}
                        fill="#ff0000"
                        fillOpacity={0.2}
                      />
                    );
                  }
                  return null;
                })}
                
                <Line 
                  type="linear" 
                  dataKey="dataPoint" 
                  stroke="#0066cc" 
                  name={t.dataPoint} 
                  dot={true} 
                  label={{ fill: '#666', fontSize: 10, position: 'top' }} 
                />
                <Line 
                  type="linear" 
                  dataKey="lcl" 
                  stroke="#ff0000" 
                  name={t.lcl} 
                  dot={false} 
                  activeDot={false} 
                  strokeWidth={1.5}
                />
                <Line 
                  type="linear" 
                  dataKey="ucl" 
                  stroke="#ff0000" 
                  name={t.ucl} 
                  dot={false} 
                  activeDot={false} 
                  strokeWidth={1.5}
                />
                <Line 
                  type="linear" 
                  dataKey="dpa" 
                  stroke="#008800" 
                  name={t.dpa} 
                  dot={false} 
                  activeDot={false} 
                  strokeWidth={1.5}
                />
                <Line 
                  type="linear" 
                  dataKey="dla" 
                  stroke="#008800" 
                  name={t.dla} 
                  dot={false} 
                  activeDot={false} 
                  strokeDasharray="5 5"
                />
                <Line 
                  type="linear" 
                  dataKey="dua" 
                  stroke="#008800" 
                  name={t.dua} 
                  dot={false} 
                  activeDot={false} 
                  strokeDasharray="5 5"
                />
                
                {/* Threshold lines */}
                {showThresholds && results.thresholds && results.thresholds.map((threshold, index) => (
                  <ReferenceLine 
                    key={index}
                    y={threshold.value}
                    stroke="#FFC107"
                    strokeDasharray="3 3"
                    label={{ 
                      value: language === 'en' ? threshold.label : (threshold.label.startsWith("Target") ? `Umbral ${index + 1}` : threshold.label), 
                      fill: '#FFC107', 
                      fontSize: 10 
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* SPC Data Table */}
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {timeUnit === 'month' ? t.startMonth : t.startWeek}/{t.startYear}
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.dataPoint}
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.movingRange}
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.dpa}
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.lcl}
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.ucl}
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.ruleApplied}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.combinedData.map((point, index) => (
                  <tr key={index} className={point.signal ? "bg-red-100" : ""}>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.label}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.dataPoint}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.movingRange}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.dpa}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.lcl}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.ucl}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {point.ruleApplied}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button
            onClick={handleDownload}
            className="p-2 bg-purple-600 text-white rounded-md"
          >
            {t.download}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessBehaviorCalculator;