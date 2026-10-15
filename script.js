function calculate() {
    // ===== 1. قراءة القيم المدخلة =====
    const demand = parseFloat(document.getElementById('demand').value);
    const area = parseFloat(document.getElementById('area').value);
    const sunHours = parseFloat(document.getElementById('region').value);
    const pricePerKwh = parseFloat(document.getElementById('price').value) / 100; // تحويل لهللة إلى ريال
    const systemType = document.querySelector('input[name="systemType"]:checked').value;

    // ===== التحقق من صحة البيانات =====
    if (!demand || !area || !pricePerKwh) {
        alert('⚠️ الرجاء ملء جميع الحقول المطلوبة!');
        return;
    }

    // ===== معادلات حسابية أساسية =====
    const panelPower = 550;          // قدرة اللوح الواحد (واط)
    const panelArea = 2.2;           // مساحة اللوح الواحد (م²)
    const systemEfficiency = 0.85;   // كفاءة النظام الكلية (مع الخسائر)
    const panelPrice = 850;          // تكلفة اللوح الواحد (ريال)
    const inverterCostPerKW = 700;   // تكلفة المحول لكل كيلوواط (ريال)
    const batteryCostPerKwh = 800;   // تكلفة البطارية لكل كيلوواط ساعي
    const installationRate = 0.25;   // نسبة تكلفة التركيب والمواد المساعدة
    const systemLifetime = 25;       // عمر النظام الافتراضي (سنة)

    // ===== الحسابات الفنية =====
    let requiredKWp = demand / sunHours / systemEfficiency;
    
    // إضافة ساعات احتياطي للأنظمة المنفصلة عن الشبكة
    let batteryCapacityKwh = 0;
    if (systemType === 'offgrid') {
        batteryCapacityKwh = demand * 1.5; // احتياطي 1.5 يوم
        requiredKWp *= 1.2; // زيادة قدرة النظام بنسبة 20%
    }

    const panelCount = Math.ceil((requiredKWp * 1000) / panelPower);
    const totalAreaNeeded = panelCount * panelArea;
    const inverterSize = Math.ceil(requiredKWp * 1.1); // زيادة أمان 10%

    // ===== الحسابات الاقتصادية =====
    const costPanels = panelCount * panelPrice;
    const costInverter = inverterSize * inverterCostPerKW;
    const costBatteries = batteryCapacityKwh * batteryCostPerKwh;
    const costInstallation = (costPanels + costInverter + costBatteries) * installationRate;
    const totalCost = costPanels + costInverter + costBatteries + costInstallation;

    const yearlyProduction = requiredKWp * sunHours * 365 * systemEfficiency;
    const yearlySavings = Math.min(demand * 365, yearlyProduction) * pricePerKwh;
    const paybackYears = totalCost / yearlySavings;

    // ===== تحديد الجدوى الاقتصادية =====
    let verdict, verdictColor;
    if (paybackYears <= 6) {
        verdict = '✅ ممتاز — فترة استرداد قصيرة جداً، استثمار ممتاز!';
        verdictColor = 'green';
    } else if (paybackYears <= 10) {
        verdict = '⚠️ مقبول — الجدوى الاقتصادية جيدة ومتوقعة';
        verdictColor = '#e65100';
    } else {
        verdict = '❌ غير مجدٍ حالياً — قد تحتاج لمراجعة استهلاكك أو مساحتك';
        verdictColor = 'red';
    }

    // ===== مقارنة المساحة المتاحة والمطلوبة =====
    let areaMessage;
    if (totalAreaNeeded <= area) {
        areaMessage = `✅ المساحة كافية — تحتاج فقط ${totalAreaNeeded.toFixed(1)} م² من مساحتك`;
    } else {
        areaMessage = `❌ المساحة غير كافية — تحتاج ${totalAreaNeeded.toFixed(1)} م² ولديك فقط ${area} م²`;
    }

    // ===== عرض النتائج في الصفحة =====
    const output = document.getElementById('output');
    output.innerHTML = `
        <h3 style="color:#333; font-size:16px; margin-bottom:10px;">🔧 النتائج الفنية</h3>
        <p><strong>قدرة النظام المطلوبة:</strong> ${requiredKWp.toFixed(2)} كيلوواط ذروي</p>
        <p><strong>عدد الألواح الشمسية:</strong> ${panelCount} لوح (${panelPower} واط)</p>
        <p><strong>المساحة المطلوبة:</strong> ${totalAreaNeeded.toFixed(1)} م²</p>
        <p style="color:${totalAreaNeeded <= area ? 'green' : 'red'}">${areaMessage}</p>
        <p><strong>المحول المقترح:</strong> ${inverterSize} كيلوواط</p>
        ${systemType === 'offgrid' 
            ? `<p><strong>سعة البطاريات:</strong> ${batteryCapacityKwh.toFixed(1)} ك.و.س (احتياطي 1.5 يوم)</p>` 
            : '<p><strong>البطاريات:</strong> لا تحتاج لبطاريات (نظام متصل بالشبكة)</p>'
        }
        
        <hr>
        
        <h3 style="color:#333; font-size:16px; margin-bottom:10px;">💰 النتائج الاقتصادية</h3>
        <p><strong>تكلفة الألواح:</strong> ${costPanels.toFixed(0)} ريال</p>
        <p><strong>تكلفة المحول:</strong> ${costInverter.toFixed(0)} ريال</p>
        ${systemType === 'offgrid' ? `<p><strong>تكلفة البطاريات:</strong> ${costBatteries.toFixed(0)} ريال</p>` : ''}
        <p><strong>تكلفة التركيب والمواد:</strong> ${costInstallation.toFixed(0)} ريال</p>
        <p style="font-size:16px; font-weight:bold; color:#d84315; margin-top:5px;">
            التكلفة الإجمالية: ${totalCost.toFixed(0)} ريال
        </p>
        <p><strong>التوفير السنوي في الفواتير:</strong> ${yearlySavings.toFixed(0)} ريال/سنة</p>
        <p><strong>فترة استرداد رأس المال:</strong> ${paybackYears.toFixed(1)} سنة</p>
        <p style="font-size:16px; font-weight:bold; color:${verdictColor}; margin-top:10px;">
            النتيجة النهائية: ${verdict}
        </p>
        <p style="font-size:13px; color:#777; margin-top:10px;">
            * بناءً على عمر النظام الافتراضي ${systemLifetime} سنة، متوسط الإشعاع الشمسي لمنطقتك
        </p>
    `;

    // إظهار قسم النتائج
    document.getElementById('results').style.display = 'block';
    
    // التمرير إلى النتائج
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
