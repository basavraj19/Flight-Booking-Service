function comapreTime(time1,time2)
{
    let Date1=new Date(time1);
    let Date2=new Date(time2);
    return Date1.getTime()>Date2.getTime();
}

module.exports =
{
    comapreTime
}