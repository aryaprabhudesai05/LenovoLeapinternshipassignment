import DashboardCard from "../../components/cards/DashboardCard";

export default function Dashboard(){

return(

<>

<h1>Dashboard</h1>

<div className="cards">

<DashboardCard
title="Career Score"
value="92%"
/>

<DashboardCard
title="ATS Score"
value="88%"
/>

<DashboardCard
title="Learning Progress"
value="74%"
/>

<DashboardCard
title="Job Match"
value="81%"
/>

</div>

</>

)

}