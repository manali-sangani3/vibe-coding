const baseUrl = 'http://localhost:3000/v1';

async function login(ssoToken) {
  const res = await fetch(`${baseUrl}/auth/sso-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ssoToken }),
  });
  if (!res.ok) throw new Error(`Login failed for ${ssoToken}: ` + await res.text());
  const data = await res.json();
  return data.accessToken;
}

async function request(path, method, token, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API error ${method} ${path}: ` + await res.text());
  }
  return res.json();
}

async function runTest() {
  console.log('--- STARTING E2E TEST ---');

  // 1. Logins
  console.log('1. Logging in as Employee, Manager, and Finance...');
  const empToken = await login('emp');
  const mgrToken = await login('manager');
  const finToken = await login('finance');

  // 2. Employee submits travel request
  console.log('2. Employee submitting a travel request...');
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 60);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 5);

  const trRes = await request('/travel', 'POST', empToken, {
    title: 'E2E Test Trip to NYC',
    description: 'Client meeting',
    purpose: 'Client Meeting',
    destination: 'New York',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    estimatedCost: 1500,
  });
  const trId = trRes.id;
  console.log(`   -> Travel Request ID: ${trId}`);

  // 3. Manager approves stage
  console.log('3. Manager checking pending approvals...');
  const mgrApprovals = await request('/approvals/pending', 'GET', mgrToken);
  const l1Stage = mgrApprovals.data.find(a => a.requestId === trId);
  if (!l1Stage) throw new Error('No L1 pending approval found for this request!');
  
  console.log(`   -> Approving stage ID: ${l1Stage.id} as Manager`);
  await request(`/approvals/${l1Stage.id}/approve`, 'POST', mgrToken);

  // 4. Finance approves stage (L3)
  console.log('4. Finance checking pending approvals...');
  const finApprovals = await request('/approvals/pending', 'GET', finToken);
  const l3Stage = finApprovals.data.find(a => a.requestId === trId);
  if (!l3Stage) throw new Error('No L3 pending approval found for this request!');

  console.log(`   -> Approving stage ID: ${l3Stage.id} as Finance`);
  await request(`/approvals/${l3Stage.id}/approve`, 'POST', finToken);

  console.log('   -> Travel Request is now FULLY APPROVED!');

  // 5. Employee submits Expense Claim
  console.log('5. Employee submitting Expense Claim against the TR...');
  const claimRes = await request('/expenses', 'POST', empToken, {
    travelRequestId: trId,
    items: [
      {
        category: 'Meals',
        amount: 250,
        description: 'Dinner with client',
      }
    ]
  });
  const claimId = claimRes.id;
  console.log(`   -> Expense Claim ID: ${claimId}`);

  // 6. Finance approves Expense Claim
  console.log('6. Finance approving Expense Claim...');
  await request(`/expenses/${claimId}/approve`, 'POST', finToken);
  console.log('   -> Expense Claim is now APPROVED!');

  // 7. Finance gets pending reimbursements and pays it
  console.log('7. Finance getting pending reimbursements queue...');
  const reimbursements = await request('/reimbursements/pending', 'GET', finToken);
  const rClaim = reimbursements.data.find(r => r.id === claimId);
  if (!rClaim) throw new Error('Expense claim not found in Reimbursement queue!');

  console.log(`   -> Processing payout for claim ${claimId}...`);
  const paymentRef = `TEST-PAY-${Date.now()}`;
  await request(`/reimbursements/${claimId}/pay`, 'POST', finToken, { paymentRef });
  console.log(`   -> SUCCESS! Reimbursement processed with ref: ${paymentRef}`);

  console.log('--- E2E TEST COMPLETED SUCCESSFULLY ---');
}

runTest().catch(err => {
  console.error('\nE2E TEST FAILED:');
  console.error(err.message);
});
