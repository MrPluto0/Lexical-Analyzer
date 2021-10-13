#include <stdio.h>
int part(int a[], int low, int high);
void quicksort(int a[], int low, int high);
int main()
{
	int n;
	scanf("%d", &n);
	int a[n];
	for (int i = 0; i < n; i++)
		scanf("%d", &a[i]);
	quicksort(a, 0, n - 1);
	for (int i = 0; i < n; i++)
		printf("%d ", a[i]);
	return 0;
}
int part(int a[], int low, int high)
{
	int temp = a[low];
	while (low < high)
	{
		while (low < high && a[high] > temp)
			high--;
		a[low] = a[high];
		while (low < high && a[low] <= temp)
			low++;
		a[high] = a[low];
	}
	a[low] = temp;
	return low;
}
void quicksort(int a[], int low, int high)
{
	if (low < high)
	{
		int mid = part(a, low, high);
		quicksort(a, low, mid - 1);
		quicksort(a, mid + 1, high);
	}
}
/*
    int p = (round(1.0*rand()/RAND_MAX)*(right-left)+left);
    swap(A[p],A[left]);
*/
