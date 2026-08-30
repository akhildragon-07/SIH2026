import java.util.Scanner; 
 
interface OBSTOperations { 
    void computeW(); 
} 
 
class OBST implements OBSTOperations { 
 
    int n; 
    int[] keys; 
    int[] p; 
    int[] q; 
 
    OBST(int n, int[] keys, int[] p, int[] q) { 
        this.n = n; 
        this.keys = keys; 
        this.p = p; 
        this.q = q; 
    } 
 
    public void computeW() { 
 
        int[][] w = new int[n + 1][n + 1]; 
 
        // W[i][i-1] = q[i-1]
        for (int i = 1; i <= n; i++) { 
            w[i][i - 1] = q[i - 1]; 
        } 
 
        // Calculate weight matrix
        for (int i = 1; i <= n; i++) { 
            for (int j = i; j <= n; j++) { 
                w[i][j] = w[i][j - 1] + p[j] + q[j]; 
            } 
        } 
 
        // Print weight matrix including W[i][i-1]
        for (int i = 1; i <= n; i++) { 
            for (int j = i - 1; j <= n; j++) { 
                if (j > i - 1) { 
                    System.out.print(" "); 
                } 
                System.out.print(w[i][j]); 
            } 
            System.out.println(); 
        } 
    } 
} 
 
public class Main { 
 
    public static void main(String[] args) { 
 
        Scanner sc = new Scanner(System.in); 
 
        int numberOfKeys = sc.nextInt(); 
 
        int[] keys = new int[numberOfKeys + 1]; 
        int[] p = new int[numberOfKeys + 1]; 
        int[] q = new int[numberOfKeys + 1]; 
 
        for (int i = 1; i <= numberOfKeys; i++) { 
            keys[i] = sc.nextInt(); 
        } 
 
        for (int i = 1; i <= numberOfKeys; i++) { 
            p[i] = sc.nextInt(); 
        } 
 
        for (int i = 0; i <= numberOfKeys; i++) { 
            q[i] = sc.nextInt(); 
        } 
 
        OBST obst = new OBST(numberOfKeys, keys, p, q); 
        obst.computeW(); 
 
        sc.close(); 
    } 
}